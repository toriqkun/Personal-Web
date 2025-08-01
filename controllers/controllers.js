const pool = require("../postgres");
const moment = require("moment");
const uploadToCloudinary = require("../middlewares/upload-file");

// Helper
function parseToISO(dateStr) {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split("/");
  if (!day || !month || !year) return null;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function validateAndUploadImage(file) {
  return new Promise(async (resolve, reject) => {
    if (!file || !file.mimetype.startsWith("image/")) {
      return reject(new Error("Invalid image file."));
    }

    try {
      const result = await uploadToCloudinary(`data:${file.mimetype};base64,${file.data.toString("base64")}`);
      resolve(result.secure_url);
    } catch (err) {
      reject(err);
    }
  });
}

async function handleTechStack(req, res) {
  try {
    const { nameTools } = req.body;
    const imageFile = req.files?.image;

    if (!nameTools || !imageFile) {
      return res.status(400).send("Please fill in all fields and upload an image.");
    }

    const image_url = await validateAndUploadImage(imageFile);

    const query = `INSERT INTO public.tech_stack (image, tools_name) VALUES ($1, $2)`;
    await pool.query(query, [image_url, nameTools]);

    return res.redirect("/");
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Internal Server Error");
  }
}

async function handleExperience(req, res) {
  try {
    const { position, company, sdate, edate, present, techno } = req.body;
    const imageFile = req.files?.image;

    if (!position || !company || !sdate) {
      return res.status(400).send("Please fill in required fields.");
    }

    if (present !== "on" && (!edate || edate.trim() === "")) {
      return res.status(400).send("Please provide an end date or mark as present.");
    }

    const techsArray = techno?.split(",").map(t => t.trim()).filter(Boolean);
    if (!techsArray || techsArray.length < 2) {
      return res.status(400).send("Please fill in at least two technologies.");
    }

    if (!imageFile) {
      return res.status(400).send("Please upload an image.");
    }

    const jobs = [req.body.job1, req.body.job2, req.body.job3, req.body.job4, req.body.job5]
      .filter(j => j?.trim())
      .map(j => j.trim());
    const job_responsibilities = jobs.join("|||");

    let endDate = edate && edate.trim() !== "" ? parseToISO(edate) : null;
    if (present === "on") endDate = "present";

    const image_url = await validateAndUploadImage(imageFile);
    const query = `
      INSERT INTO my_experience (position, company, start_date, end_date, job_responsibilities, technologies, image)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await pool.query(query, [position, company, sdate, endDate, job_responsibilities, techno, image_url]);

    return res.redirect("/");
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Internal Server Error");
  }
}

async function handleProjects(req, res) {
  try {
    const { project_name, description, repo_link, live_demo, technologies } = req.body;
    const imageFile = req.files?.image;

    if (!project_name || !description || !technologies || !imageFile) {
      return res.status(400).send("Missing required fields.");
    }

    const techsArray = technologies?.split(",").map(t => t.trim()).filter(Boolean);
    if (!techsArray || techsArray.length < 2) {
      return res.status(400).send("Technologies must contain at least two values.");
    }

    const image_url = await validateAndUploadImage(imageFile);

    const query = `
      INSERT INTO my_projects (project_name, description, technologies, image, repo_link, live_demo)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await pool.query(query, [project_name, description, technologies, image_url, repo_link, live_demo]);

    return res.redirect("/");
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  handleTechStack,
  handleExperience,
  handleProjects,
};
