const serverless = require("serverless-http");
const express = require("express");
const { engine } = require("express-handlebars");
const fileUpload = require("express-fileupload");
const path = require("path");
require("dotenv").config({ path: require("path").resolve(__dirname, "..", ".env.local") });

const pool = require("../postgres");
const { handleTechStack, handleExperience, handleProjects } = require("../controllers/controllers");

const app = express();

// Middlewares
app.use("/assets", express.static(path.join(__dirname, "..", "assets")));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

// Setup View Engine
app.engine(
  "hbs",
  engine({
    layoutsDir: path.join(__dirname, "..", "views", "layout"),
    partialsDir: path.join(__dirname, "..", "views", "partials"),
    defaultLayout: "main",
    extname: "hbs",
  })
);
app.set("views", path.join(__dirname, "..", "views"));

// Helper function untuk format tanggal pengalaman kerja
function formatExperienceDate(dateStr) {
  if (!dateStr) return "";
  if (typeof dateStr === "string" && dateStr.toLowerCase() === "present") return "Present";

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

app.get("/debug-schema", async (req, res) => {
  try {
    const currentSchema = await pool.query("SELECT current_schema();");
    const exists = await pool.query(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_name = 'my_experience';
    `);
    res.json({
      current_schema: currentSchema.rows,
      found: exists.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Routes Portofolio (Home Page)
app.get("/", async (req, res) => {
  try {
    const experienceResult = await pool.query("SELECT * FROM public.my_experience ORDER BY id DESC");

    // Proses data experiences untuk tampilan
    const experiences = experienceResult.rows.map((row) => {
      const startDateFormatted = formatExperienceDate(row.start_date);
      const endDateFormatted = formatExperienceDate(row.end_date);

      let displayDate;
      if (row.end_date === "present") {
        displayDate = `${startDateFormatted} - Present`;
      } else if (startDateFormatted && endDateFormatted) {
        displayDate = `${startDateFormatted} - ${endDateFormatted}`;
      } else {
        displayDate = "";
      }

      return {
        id: row.id,
        position: row.position,
        company: row.company,
        displayDate: displayDate,
        responsibilities: row.job_responsibilities ? row.job_responsibilities.split("|||").map((item) => item.trim()) : [],
        technologies: row.technologies ? row.technologies.split(", ").map((item) => item.trim()) : [],
        imageUrl: row.image,
      };
    });

    const techStackResult = await pool.query("SELECT id, image, tools_name FROM public.tech_stack ORDER BY id ASC");
    const techStacks = techStackResult.rows;

    const projectResult = await pool.query("SELECT * FROM public.my_projects ORDER BY id DESC");
    const projects = projectResult.rows.map((row) => {
      return {
        id: row.id,
        project_name: row.project_name,
        description: row.description,
        technologies_array: row.technologies ? row.technologies.split(",").map((tech) => tech.trim()) : [],
        image_url: row.image,
        repo_link: row.repo_link,
        live_demo: row.live_demo,

        // isPrivateRepo: True jika repo_link adalah NULL/kosong/spasi
        isPrivateRepo: !row.repo_link || row.repo_link.trim() === "",
        // hasLiveDemo: True jika live_demo tidak NULL/kosong/spasi
        hasLiveDemo: !!row.live_demo && row.live_demo.trim() !== "",
      };
    });

    res.render("portofolio", {
      title: "Toriq Rosid",
      experiences: experiences,
      techStacks: techStacks,
      projects: projects,
      showFooter: true,
    });
  } catch (err) {
    console.error("Error fetching data for portfolio page:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Routes addTechStack
app.get("/add-techstack", (req, res) => {
  res.render("addTechStack", { title: "Form Techstack", showFooter: false });
});
app.post("/add-techstack", handleTechStack);

// Routes addExperience
app.get("/add-experience", (req, res) => {
  res.render("addExperience", { title: "Form Experience", showFooter: false });
});
app.post("/add-experience", handleExperience);

// Route My Projects
app.get("/add-projects", (req, res) => {
  res.render("addProject", { title: "Form Projects", showFooter: false });
});
app.post("/add-projects", handleProjects);

// export handler untuk Vercel
module.exports = app;
module.exports.handler = serverless(app);
