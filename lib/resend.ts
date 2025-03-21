import { Resend } from "resend";
import {Doctor} from "@prisma/client"

export const resend = new Resend(process.env.RESEND_API_KEY);
