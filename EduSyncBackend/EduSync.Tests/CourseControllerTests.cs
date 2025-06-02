using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EduSyncBackend.Controllers;
using EduSyncBackend.Data;
using EduSyncBackend.DTOs;
using EduSyncBackend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using NUnit.Framework;

namespace EduSyncBackend.Tests
{
    [TestFixture]
    public class CourseControllerTests
    {
        private AppDbContext _context;
        private IMapper _mapper;
        private IConfiguration _configuration;
        private CourseController _controller;

        [SetUp]
        public void SetUp()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);

            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Course, CourseDto>();
            });

            _mapper = config.CreateMapper();

            var settings = new Dictionary<string, string>
            {
                { "AzureBlob:ConnectionString", "UseDevelopmentStorage=true" },
                { "AzureBlob:ContainerName", "test-container" }
            };

            _configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(settings)
                .Build();

            _controller = new CourseController(_context, _mapper, _configuration);
        }

       

        [Test]
        public async Task GetAllCourses_ReturnsOkWithCourses()
        {
            var instructor = new User
            {
                UserId = Guid.NewGuid(),
                Name = "Instructor",
                Role = "Instructor",
                Email = "i@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test@123")  // <-- Proper hashed password
            };

            var course = new Course
            {
                CourseId = Guid.NewGuid(),
                Title = "Test Course",
                Description = "Description",
                Instructor = instructor,
                InstructorId = instructor.UserId,
                MediaUrl = "https://teststorage.blob.core.windows.net/test-container/testvideo.mp4" // <-- add this
            };

            _context.Users.Add(instructor);
            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            var result = await _controller.GetAllCourses();

            Assert.That(result, Is.TypeOf<OkObjectResult>());
            var okResult = result as OkObjectResult;
            Assert.That(okResult!.StatusCode, Is.EqualTo(200).Or.Null);
            Assert.That(okResult.Value, Is.Not.Null);
        }

       

        [Test]
        public async Task GetCoursesByInstructor_NoCoursesFound_ReturnsNotFound()
        {
            var result = await _controller.GetCoursesByInstructor(Guid.NewGuid());

            Assert.That(result, Is.TypeOf<NotFoundObjectResult>());
            var notFoundResult = result as NotFoundObjectResult;
            Assert.That(notFoundResult!.StatusCode, Is.EqualTo(404));
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
        }


    }
}
