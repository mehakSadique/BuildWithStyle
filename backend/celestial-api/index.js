import swisseph from "swisseph";
import moment from "moment-timezone";

const EPHEMERIS_PATH = "./data/";

// Set path to ephemeris data
swisseph.swe_set_ephe_path(EPHEMERIS_PATH);

// Test data
let user = { dateOfBirth: "1993-01-17", timeOfBirth: "17:20", timezone: "America/New_York" };

let utcDateTime = moment.tz(`${user.dateOfBirth} ${user.timeOfBirth}`, "YYYY-MM-DD HH:mm", user.timezone).utc();
console.log("UTC Time: ", utcDateTime.format());

// Convert birthdate and time to Julian Date
let julianDate = getJulianDate(utcDateTime);
console.log("Julian Date: ", julianDate);

// Calculate planetary positions
getPlanetPositions(julianDate)
    .then((positions) => {
        console.log("Planetary Positions:", positions); 
    })
    .catch((err) => {
        console.error("Error:", err.message); 
    });

// Function to convert birth date/time to Julian Date
function getJulianDate(utcDateTime) {
    const jd = swisseph.swe_julday(
      utcDateTime.year(),
      utcDateTime.month() + 1, // Months are 1-based in Swiss Ephemeris,
      utcDateTime.date(),
      utcDateTime.hour() + utcDateTime.minute() / 60.0,
      swisseph.SE_GREG_CAL
    );
    return jd;
  }

// Function to calculate planetary positions
function getPlanetPositions(jd) {
    return new Promise((resolve, reject) => {
        const planets = {
            sun: swisseph.SE_SUN,
            moon: swisseph.SE_MOON,
            venus: swisseph.SE_VENUS,
        };

        let results = {};

        let planetPromises = Object.keys(planets).map((key) => {
            return new Promise((res, rej) => {
                swisseph.swe_calc_ut(jd, planets[key], swisseph.SEFLG_SWIEPH, (result) => {
                    if (result.error) {
                        rej(result.error);
                    } else {
                        results[key] = getSign(result.longitude);
                        res(); // Resolve the inner promise
                    }
                });
            });
        });

        Promise.all(planetPromises)
            .then(() => resolve(results))
            .catch(reject);
    });
}

// Convert planetary longitude to zodiac sign
function getSign(longitude) {
    const signs = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
    ];
    return signs[Math.floor(longitude / 30)];
}


swisseph.swe_calc_ut(julianDate, swisseph.SE_MOON, swisseph.SEFLG_SWIEPH, (result) => {
    if (result.error) {
        console.error("Moon Error:", result.error);
    } else {
        console.log("Moon Longitude:", result.longitude);  // Log the moon's longitude
    }
});