const countries = require("../utils/countries.json");

const getCountries = async (req, res) => {
  try {
    const { size, countryName, shortCountryName, phoneCode, region, ...extraParams } = req.query;

    // 1. Validate for unknown/unsupported parameters
    if (Object.keys(extraParams).length > 0) {
      return res.status(400).json({
        message: "Invalid parameter value",
        error: "Unsupported query parameter detected",
      });
    }

    // 2. Validate 'size' if provided
    let limit = countries.length;
    if (size !== undefined) {
      const parsedSize = parseInt(size);
      if (isNaN(parsedSize) || parsedSize < 1) {
        return res.status(400).json({
          message: "Invalid parameter value",
          error: "size must be greater than or equal to 1",
        });
      }
      limit = parsedSize;
    }

    // 3. Apply Filters (AND logic)
    let filteredCountries = countries.filter((country) => {
      let matches = true;

      if (countryName) {
        matches = matches && country.name.toLowerCase().includes(countryName.toLowerCase());
      }
      if (shortCountryName) {
        matches = matches && country.short_code.toLowerCase().includes(shortCountryName.toLowerCase());
      }
      if (phoneCode) {
        // phoneCode usually includes '+', we match exactly as stored or partially if desired
        // Requirement says "exact match recommended" for phoneCode
        matches = matches && country.phone_code === phoneCode;
      }
      if (region) {
        matches = matches && country.region.toLowerCase() === region.toLowerCase();
      }

      return matches;
    });

    // 4. Apply Pagination (size limit)
    const paginatedData = filteredCountries.slice(0, limit);

    return res.status(200).json({
      message: "Countries fetched successfully",
      count: paginatedData.length,
      data: paginatedData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch country list",
      error: error.message,
    });
  }
};

module.exports = {
  getCountries,
};
