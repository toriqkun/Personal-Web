// VALIDASI ALERT GUNA SWEET ALERT
document.addEventListener("DOMContentLoaded", () => {
  // =====================
  // 🔷 FORM ADD PROJECTS
  // =====================
  const projectForm = document.querySelector('form[action="/add-projects"]');
  if (projectForm) {
    projectForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const project_name = projectForm.project_name?.value.trim();
      const description = projectForm.description?.value.trim();
      const technologies = projectForm.technologies?.value.trim();
      const imageInput = projectForm.querySelector('input[name="image"]');

      if (!project_name || !description || !technologies || !imageInput?.files?.length) {
        await Swal.fire({
          icon: "warning",
          title: "Oops!",
          text: "Please fill in the project name, description, technologies, and upload an image.",
          confirmButtonText: "OK",
        });
        return;
      }

      const techs = technologies
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      if (techs.length < 2) {
        await Swal.fire({
          icon: "warning",
          title: "Oops!",
          text: "Please fill in technologies, at least two, and separate them with a (,) sign.",
          confirmButtonText: "OK",
        });
        return;
      }

      const formData = new FormData(projectForm);
      try {
        const resp = await fetch(projectForm.action, {
          method: "POST",
          body: formData,
        });

        if (resp.ok) {
          await Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Project added successfully.",
            confirmButtonText: "OK",
          });

          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({ type: "new-project-added" }, window.location.origin);
            window.close();
            return; // 🛑 Stop here, don't continue
          }

          // fallback jika bukan dari window.opener
          window.location.href = "/";
          return;
        } else {
          const text = await resp.text();
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: text || "Failed to add project.",
          });
        }
      } catch (err) {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Unexpected error.",
        });
        console.error(err);
      }
    });
  }

  // ==========================
  // 🔶 FORM ADD EXPERIENCE
  // ==========================
  const experienceForm = document.querySelector('form[action="/add-experience"]');
  if (experienceForm) {
    experienceForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const position = experienceForm.position?.value.trim();
      const company = experienceForm.company?.value.trim();
      const startDate = experienceForm.sdate?.value.trim();
      const endDate = experienceForm.edate?.value.trim();
      const presentChecked = experienceForm.present?.checked;
      const technoRaw = experienceForm.techno?.value.trim();
      const imageInput = experienceForm.querySelector('input[name="image"]');
      const jobs = [
        experienceForm.job1?.value.trim(),
        experienceForm.job2?.value.trim(),
        experienceForm.job3?.value.trim(),
        experienceForm.job4?.value.trim(),
        experienceForm.job5?.value.trim(),
      ].filter((j) => j);

      // Validasi required
      if (!position || !company || !startDate) {
        await Swal.fire({
          icon: "warning",
          title: "Oops!",
          text: "Please fill in all fields.",
          confirmButtonText: "OK",
        });
        return;
      }

      if (!presentChecked && !endDate) {
        await Swal.fire({
          icon: "warning",
          title: "Oops!",
          text: "Please fill in all fields.",
          confirmButtonText: "OK",
        });
        return;
      }

      const techsArray = (technoRaw || "")
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      if (techsArray.length < 2) {
        await Swal.fire({
          icon: "warning",
          title: "Oops!",
          text: "Please fill in at least two technologies.",
          confirmButtonText: "OK",
        });
        return;
      }

      if (!imageInput?.files?.length) {
        await Swal.fire({
          icon: "warning",
          title: "Oops!",
          text: "Please fill in all fields.",
          confirmButtonText: "OK",
        });
        return;
      }

      const formData = new FormData(experienceForm);
      try {
        const resp = await fetch(experienceForm.action, { method: "POST", body: formData });
        if (resp.ok) {
          await Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Successfully added work experience.",
            confirmButtonText: "OK",
          });
          window.location.href = "/";
        } else {
          const text = await resp.text();
          await Swal.fire({ icon: "error", title: "Error", text: text || "Failed to add experience." });
        }
      } catch (err) {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Network or unexpected error occurred.",
          confirmButtonText: "OK",
        });
        console.error(err);
      }
    });
  }

  // ==========================
  // 🟣 FORM ADD TECHSTACK
  // ==========================
  const techstackForm = document.querySelector('form[action="/add-techstack"]');
  if (techstackForm) {
    techstackForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nameTools = techstackForm.nameTools?.value.trim();
      const imageInput = techstackForm.querySelector('input[name="image"]');

      if (!nameTools || !imageInput?.files?.length) {
        await Swal.fire({
          icon: "warning",
          title: "Oops!",
          text: "Please fill in all fields and upload images.",
          confirmButtonText: "OK",
        });
        return;
      }

      const formData = new FormData(techstackForm);
      try {
        const resp = await fetch(techstackForm.action, { method: "POST", body: formData });
        if (resp.ok) {
          await Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Successfully added tech stack.",
            confirmButtonText: "OK",
          });
          window.location.href = "/";
        } else {
          const text = await resp.text();
          await Swal.fire({ icon: "error", title: "Error", text: text || "Failed to add tech stack." });
        }
      } catch (err) {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Unexpected error occurred.",
          confirmButtonText: "OK",
        });
        console.error(err);
      }
    });
  }
});
