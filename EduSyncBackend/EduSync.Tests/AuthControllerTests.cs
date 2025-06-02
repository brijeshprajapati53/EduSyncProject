using EduSyncBackend.Controllers;
using EduSyncBackend.Data;
using EduSyncBackend.DTOs;
using EduSyncBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EduSyncBackend.Tests
{
    [TestFixture]
    public class AuthControllerTests
    {
        private AuthController _controller;
        private AppDbContext _context;
        private IConfiguration _configuration;

        [SetUp]
        public void SetUp()
        {
            // Use a fresh in-memory DB for each test
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);


            // JWT config for token generation
            var inMemorySettings = new Dictionary<string, string>
            {
                { "Jwt:Key", "ThisIsA32CharLongSecureKeyForJwt123!" },
                { "Jwt:Issuer", "YourIssuer" },
                { "Jwt:Audience", "YourAudience" }
            };

            _configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            _controller = new AuthController(_context, _configuration);
        }

        [Test]
        public async Task Register_WithValidData_ReturnsOk()
        {
            var dto = new RegisterDto
            {
                Name = "Test User",
                Email = "test@example.com",
                Password = "Test@123",
                Role = "Student"
            };

            var result = await _controller.Register(dto) as OkObjectResult;

            Assert.That(result, Is.Not.Null);
            Assert.That(result.StatusCode, Is.EqualTo(200));
        }

        [Test]
        public async Task Register_WithDuplicateEmail_ReturnsBadRequest()
        {
            _context.Users.Add(new User
            {
                UserId = Guid.NewGuid(),
                Name = "Existing User",
                Email = "existing@example.com",
                Role = "Instructor",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test@123")
            });
            await _context.SaveChangesAsync();

            var dto = new RegisterDto
            {
                Name = "New User",
                Email = "existing@example.com",
                Password = "Test@123",
                Role = "Student"
            };

            var result = await _controller.Register(dto) as BadRequestObjectResult;

            Assert.That(result, Is.Not.Null);
            Assert.That(result.StatusCode, Is.EqualTo(400));
            Assert.That(result.Value, Is.EqualTo("Email already exists"));
        }

        [Test]
        public async Task Login_WithCorrectCredentials_ReturnsOk()
        {
            var password = "Test@123";
            _context.Users.Add(new User
            {
                UserId = Guid.NewGuid(),
                Name = "Login User",
                Email = "login@example.com",
                Role = "Student",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password)
            });
            await _context.SaveChangesAsync();

            var dto = new LoginDto
            {
                Email = "login@example.com",
                Password = password
            };

            var result = await _controller.Login(dto) as OkObjectResult;

            Assert.That(result, Is.Not.Null);
            Assert.That(result.StatusCode, Is.EqualTo(200));
        }

        [Test]
        public async Task Login_WithInvalidPassword_ReturnsUnauthorized()
        {
            _context.Users.Add(new User
            {
                UserId = Guid.NewGuid(),
                Name = "Invalid Password User",
                Email = "invalid@example.com",
                Role = "Student",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPassword")
            });
            await _context.SaveChangesAsync();

            var dto = new LoginDto
            {
                Email = "invalid@example.com",
                Password = "WrongPassword"
            };

            var result = await _controller.Login(dto) as UnauthorizedObjectResult;

            Assert.That(result, Is.Not.Null);
            Assert.That(result.StatusCode, Is.EqualTo(401));
            Assert.That(result.Value, Is.EqualTo("Invalid credentials"));
        }

        [Test]
        public async Task Login_WithNonExistentEmail_ReturnsUnauthorized()
        {
            var dto = new LoginDto
            {
                Email = "notfound@example.com",
                Password = "AnyPassword"
            };

            var result = await _controller.Login(dto) as UnauthorizedObjectResult;

            Assert.That(result, Is.Not.Null);
            Assert.That(result.StatusCode, Is.EqualTo(401));
            Assert.That(result.Value, Is.EqualTo("Invalid credentials"));
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
        }


    }
}
