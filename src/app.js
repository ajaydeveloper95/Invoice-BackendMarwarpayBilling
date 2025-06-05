import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import amgRoutes from "./routes/amg.routes.js";
import mediRoutes from "./routes/mediterrance.routes.js";
import mindMatrixRoutes from "./routes/mindmatrix.routes.js";
import suncareRoutes from "./routes/suncare.routes.js";
import nearasonRoutes from "./routes/nearson.routes.js";
import impactRoutes from "./routes/impact.routes.js";
import welexopayRoutes from "./routes/welexopay.routes.js";
import { errors } from "celebrate";

// for use body data
app.use(
    express.json()
);

const corsOptions = {
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200,
};

// Use CORS middleware
app.use(cors(corsOptions));

// for use urlencoded with different
app.use(express.urlencoded({ extended: false }));

// for use static file serve
app.use(express.static("public"));

// for use static file pdf
app.use(express.static("AllGeneratedPdf"));

// for use secure cookies manuplation
app.use(cookieParser());

// api Route for user Setup
app.use("/v1/user", userRoutes);

// api Route for user Setup
app.use("/v1/amg", amgRoutes);

// api Route for medi Setup
app.use("/v1/medi", mediRoutes);

// api Route for mind matrix Setup
app.use("/v1/mindmatrix", mindMatrixRoutes);

// api Route for suncare Setup
app.use("/v1/suncare", suncareRoutes);

// api Route for Nearason solutions
app.use("/v1/nearson", nearasonRoutes);

// api Route for Impact solutions
app.use("/v1/impact", impactRoutes);

// api Route for Impact solutions
app.use("/v1/welexopay", welexopayRoutes);

// api Route for user Setup
app.all("*", (req, res) => {
    res.status(200).json({ message: "Failed", data: "No Route Found Try Again !" })
});


// Joi Vaidator error middlewares setup
app.use(errors());

export default app;