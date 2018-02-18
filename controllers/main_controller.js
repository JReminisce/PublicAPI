"use strict"

/**
 * GET /
 * Main Routes
 */
exports.home_page = (req, res) => {
  res.render("pages/home_page.ejs", {})
}