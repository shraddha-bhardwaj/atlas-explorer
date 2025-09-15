console.log("Country Explorer - Database Population Script");

async function populateDatabase() {
  try {
    console.log("Fetching countries data from REST API");

    const response = await fetch("http://localhost:3000/api/populate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(" Success:", result.message);
    console.log(` Total countries: ${result.count}`);
  } catch (error) {
    console.error(" Error:", error.message);

    if (
      error.message.includes("ECONNREFUSED") ||
      error.message.includes("MongoDB")
    ) {
      console.log("Make sure MongoDB is running:");
      console.log("docker-compose up -d");
      console.log("or install MongoDB locally");
    }
  }
}

if (require.main === module) {
  console.log("Starting database population...\n");

  setTimeout(populateDatabase, 1000);
}

module.exports = { populateDatabase };
