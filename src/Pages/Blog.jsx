import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaArrowRight } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ReTitle } from 're-title';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { toast } from "react-toastify";

const Blog = () => {
  const [subscribing, setSubscribing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribing(true);

    // Simulate a short loading period
    setTimeout(() => {
      setSubscribing(false);
      toast.success("You have successfully subscribed!", {
        position: "top-center",
      });

      // Redirect after short delay so toast is visible
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }, 1500);
  };

  const blogPosts = [
    {
      id: 1,
      title: "The Future of Car Rentals: Trends to Watch in 2024",
      excerpt: "Discover how technology is transforming the car rental industry and what changes you can expect this year.",
      date: "March 15, 2024",
      author: "Sarah Johnson",
      category: "Industry Trends",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 2,
      title: "Top 10 Tips for First-Time Car Renters",
      excerpt: "Everything you need to know before renting a car for the first time to ensure a smooth experience.",
      date: "February 28, 2024",
      author: "Michael Chen",
      category: "Travel Tips",
      image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 3,
      title: "How Peer-to-Peer Rentals Are Changing the Market",
      excerpt: "Explore the benefits of peer-to-peer car sharing and why it's becoming increasingly popular to the world",
      date: "February 10, 2024",
      author: "Alex Rodriguez",
      category: "Industry Trends",
      image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 4,
      title: "Electric Vehicles in Car Rentals: A Growing Trend",
      excerpt: "Learn why EVs are becoming a staple in modern rental fleets and how they benefit both the environment and drivers.",
      date: "January 25, 2024",
      author: "Emily Carter",
      category: "Sustainability",
      image: "https://images.unsplash.com/photo-1605559424843-9e4e87b2367e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 5,
      title: "The Ultimate Guide to Long-Term Car Rentals",
      excerpt: "Find out when long-term rentals make sense and how to get the best deals for extended use.",
      date: "January 10, 2024",
      author: "James Walker",
      category: "Travel Tips",
      image: "https://images.unsplash.com/photo-1549921296-3cce02c5d9e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 6,
      title: "How to Save Money on Your Next Car Rental",
      excerpt: "Insider tips to help you cut costs without sacrificing quality or convenience to get the best deals for extended use.",
      date: "December 18, 2023",
      author: "Rachel Green",
      category: "Budget Travel",
      image: "https://images.unsplash.com/photo-1563720225566-d9703e09ec48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  const categories = [
    { name: "All Articles", count: 12 },
  ];

  const popularTags = [
    "#CarRental", "#Travel", "#RoadTrip", "#LuxuryCars",
    "#Economy", "#FamilyTravel", "#BusinessTravel", "#EVs"
  ];

  // Filter blog posts based on search term
  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black text-white" id="blog">
      <ReTitle title='Rentizo | Blog' />
      <div className="w-11/12 mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Our Blog
            </span>
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
            Insights, tips and trends in the car rental industry to enhance your travel experience.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Blog Content */}
          <div className="lg:w-2/3">
            {/* Featured Post */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                  alt="Featured Post"
                  className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 z-20 p-8">
                  <span className="inline-block px-3 py-1 bg-primary text-white text-sm font-medium rounded-full mb-3">
                    Featured
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">
                    <a href="#" className="hover:text-primary transition-colors">
                      The Complete Guide to Renting Luxury Cars
                    </a>
                  </h3>
                  <div className="flex items-center gap-4 text-gray-300 text-sm">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt /> June 5, 2024
                    </span>
                    <span className="flex items-center gap-1">
                      <FaUser /> Emily Wilson
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Search Results or Blog Posts Slider */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {searchTerm ? (
                // Show filtered results when searching
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <motion.div
                        key={post.id}
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 overflow-hidden hover:border-primary transition-all h-full"
                      >
                        <div className="relative h-48 overflow-hidden group">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 right-4">
                            <span className="inline-block px-2 py-1 bg-primary text-white text-xs font-medium rounded">
                              {post.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-4 text-gray-400 text-xs mb-3">
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt /> {post.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaUser /> {post.author}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-3 hover:text-primary transition-colors">
                            <a href="#">{post.title}</a>
                          </h3>
                          <p className="text-gray-300 mb-4">{post.excerpt}</p>
                          <a href="#" className="inline-flex items-center text-primary font-medium group">
                            Read More
                            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                          </a>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12">
                      <p className="text-xl text-gray-400">No articles found matching your search.</p>
                    </div>
                  )}
                </div>
              ) : (
                // Show regular slider when not searching
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={30}
                  slidesPerView={1}
                  breakpoints={{
                    640: {
                      slidesPerView: 1
                    },
                    768: {
                      slidesPerView: 2
                    }
                  }}
                  navigation
                  pagination={{ clickable: true }}
                  className="blog-slider"
                >
                  {blogPosts.map((post) => (
                    <SwiperSlide key={post.id}>
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 overflow-hidden hover:border-primary transition-all h-full"
                      >
                        <div className="relative h-48 overflow-hidden group">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 right-4">
                            <span className="inline-block px-2 py-1 bg-primary text-white text-xs font-medium rounded">
                              {post.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-4 text-gray-400 text-xs mb-3">
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt /> {post.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaUser /> {post.author}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-3 hover:text-primary transition-colors">
                            <a href="#">{post.title}</a>
                          </h3>
                          <p className="text-gray-300 mb-4">{post.excerpt}</p>
                          <a href="#" className="inline-flex items-center text-primary font-medium group">
                            Read More
                            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                          </a>
                        </div>
                      </motion.div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Search */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-500 pl-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-4 top-3.5 h-5 w-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </motion.div>

            {/* Categories */}
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-800 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-4 text-primary">Categories</h3>
              <ul className="space-y-3">
                {categories.map((category, index) => (
                  <li key={index}>
                    <a href="#" className="flex justify-between items-center py-2 hover:text-primary transition-colors">
                      <span>{category.name}</span>
                      <span className="px-2 py-1 bg-gray-700 text-xs rounded-full">{category.count}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Popular Tags */}
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-800 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-4 text-primary">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, index) => (
                  <a
                    key={index}
                    href="#"
                    className="inline-block px-3 py-1 bg-gray-700 hover:bg-primary text-sm rounded-full transition-colors"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-4 text-primary">Newsletter</h3>
              <p className="text-gray-300 mb-4">Subscribe to get updates on new articles and rental tips.</p>
              <form className="space-y-3" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-500"
                  required
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-lg font-semibold"
                  disabled={subscribing}
                >
                  {subscribing ? "Subscribing..." : "Subscribe"}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Swiper CSS */}
      <style jsx global>{`
        .blog-slider {
          padding-bottom: 40px;
        }
        .blog-slider .swiper-pagination-bullet {
          background: #6b7280;
          opacity: 1;
        }
        .blog-slider .swiper-pagination-bullet-active {
          background: #3b82f6;
        }
        .blog-slider .swiper-button-next,
        .blog-slider .swiper-button-prev {
          color: #3b82f6;
          background: rgba(31, 41, 55, 0.8);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .blog-slider .swiper-button-next::after,
        .blog-slider .swiper-button-prev::after {
          font-size: 1.2rem;
        }
      `}</style>
    </section>
  );
};

export default Blog;