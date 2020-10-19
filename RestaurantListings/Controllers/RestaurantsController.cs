using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RestaurantListings.Data;
using RestaurantListings.Data.Entities;

namespace RestaurantListings.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class RestaurantsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RestaurantsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Returns all restaurants.
        /// </summary>
        [HttpGet]
        public IEnumerable<Restaurant> Get()
        {
            return _context.Restaurants.ToList();
        }

        /// <summary>
        /// Set user's rating of restaurant.
        /// </summary>
        [HttpPost("rate/{restaurantId}")]
        public IActionResult AddRating(int restaurantId, RestaurantRatingInputDto input) {
            var restaurant = _context.Restaurants.Where(restaurant => restaurant.Id == restaurantId).SingleOrDefault();
            if (restaurant == null) {
                return NotFound();
            }
            var user = _context.Users.Where(user => user.Email == input.UserEmail).SingleOrDefault();
            if (user == null) {
                return Unauthorized();
            }
            if (restaurant.UsersRated.Where(userRated =>  userRated == user.Email).Count() > 0) {
                return Forbid();
            }
            restaurant.Rating = ((restaurant.Rating * (decimal)restaurant.UsersRated.Count()) + input.Rating) / (decimal)(restaurant.UsersRated.Count() + 1);
            restaurant.UsersRated.Add(user.Email);
            _context.Restaurants.Update(restaurant);
            _context.SaveChanges();
            return Ok(restaurant);
        }
    }
}
