// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const Replicate = require("replicate");

// Initialize environment variables
dotenv.config();

// Initialize Replicate API with token
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Initialize Express app and port
const app = express();
const port = process.env.PORT || 3000;

// Middleware for JSON parsing and CORS
app.use(bodyParser.json());
app.use(cors());

// Utility function for consistent error handling
const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({
    message: "An internal server error occurred",
    data: error.message || error, 
  });
};

// Route for server status
app.get("/", (req, res) => {
  res.json({
    message: "Retina.AI Server APIs",
    data: null,
  });
});

// Generic function to handle Replicate API calls
const callReplicateAPI = async (res, model, input) => {
  try {
    const output = await replicate.run(model, { input });
    res.status(200).json({
      message: "Generation is successful",
      data: output,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// POST request for generating output from Flux1.1
app.post("/image-gen-with-flux-1.1", async (req, res) => {
  const { prompt, aspect_ratio, output_format } = req.body;
  const input = {
    prompt,
    aspect_ratio,
    output_format,
    output_quality: 80,
    safety_tolerance: 4,
    prompt_upsampling: false, // Change to true for normal generations
  };

  await callReplicateAPI(res, "black-forest-labs/flux-1.1-pro", input);
});

// POST request for Flux-dev realism
app.post("/image-gen-with-flux-dev-realism", async (req, res) => {
  const { prompt, aspect_ratio, output_format, num_outputs } = req.body;
  const input = {
    prompt,
    guidance: 3.5,
    num_outputs,
    aspect_ratio,
    lora_strength: 0.8,
    output_format,
    output_quality: 100,
    num_inference_steps: 30,
  };

  await callReplicateAPI(
    res,
    "xlabs-ai/flux-dev-realism:39b3434f194f87a900d1bc2b6d4b983e90f0dde1d5022c27b52c143d670758fa",
    input
  );
});

// POST request for background remover
app.post("/background-remover", async (req, res) => {
  const { image } = req.body;
  const input = { image };

  await callReplicateAPI(
    res,
    "lucataco/remove-bg:95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1",
    input
  );
});

// POST request for image upscaler
app.post("/image-upscaler", async (req, res) => {
  const { image } = req.body;
  const input = {
    image,
    scale: 4,
    face_enhance: true,
  };

  await callReplicateAPI(
    res,
    "daanelson/real-esrgan-a100:f94d7ed4a1f7e1ffed0d51e4089e4911609d5eeee5e874ef323d2c7562624bed",
    input
  );
});

// POST request for Flux-lora GHIBSKY style
app.post("/image-gen-with-flux-lora-GHIBSKY-style", async (req, res) => {
  const { prompt, aspect_ratio, output_format, num_outputs } = req.body;
  const input = {
    model: "dev",
    prompt,
    lora_scale: 1,
    num_outputs,
    aspect_ratio,
    output_format,
    guidance_scale: 3.5,
    output_quality: 100,
    prompt_strength: 0.8,
    extra_lora_scale: 1,
    num_inference_steps: 28,
  };

  await callReplicateAPI(
    res,
    "aleksa-codes/flux-ghibsky-illustration:a9f94946fa0377091ac0bcfe61b0d62ad9a85224e4b421b677d4747914b908c0",
    input
  );
});

// POST request for Flux-lora CNSTLL style
app.post("/image-gen-with-flux-lora-CNSTLL-style", async (req, res) => {
  const { prompt, aspect_ratio, output_format, num_outputs } = req.body;
  const input = {
    model: "dev",
    prompt,
    lora_scale: 1,
    num_outputs,
    aspect_ratio,
    output_format,
    guidance_scale: 3.5,
    output_quality: 100,
    prompt_strength: 0.8,
    extra_lora_scale: 1,
    num_inference_steps: 28,
  };

  await callReplicateAPI(
    res,
    "adirik/flux-cinestill:216a43b9975de9768114644bbf8cd0cba54a923c6d0f65adceaccfc9383a938f",
    input
  );
});

// POST request for Flux-lora TOK style
app.post("/image-gen-with-flux-lora-TOK-style", async (req, res) => {
  const { prompt, aspect_ratio, output_format, num_outputs } = req.body;
  const input = {
    model: "dev",
    prompt,
    lora_scale: 1,
    num_outputs,
    aspect_ratio,
    output_format,
    guidance_scale: 3.5,
    output_quality: 100,
    prompt_strength: 0.8,
    extra_lora_scale: 1,
    num_inference_steps: 28,
  };

  await callReplicateAPI(
    res,
    "davisbrown/flux-half-illustration:687458266007b196a490e79a77bae4b123c1792900e1cb730a51344887ad9832",
    input
  );
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
