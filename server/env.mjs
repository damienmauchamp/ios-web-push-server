import {fileURLToPath} from "url";
import path            from "path";
import dotenv          from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dotenv
dotenv.config({path: `${path.normalize(__dirname)}/.env`});