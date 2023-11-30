import dotenv from "dotenv";
import path from "path";
import type { InitOptions } from "payload/config";
import payload, { Payload } from "payload";
import nodemailer from "nodemailer";
//********************IMPORTS********************
//___________________________payload client for a database________________________________________________
// part of server.ts file!

dotenv.config({
    path: path.resolve(__dirname, "../.env"),
})

// defining transporter for our email*, configured to send emails using the SMTP server hosted at "smtp.resend.com"
const transporter = nodemailer.createTransport({
    host: "smtp.resend.com",
    secure: true,
    port: 465, // standard port for email
    auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY
    }
})

let cached = (global as any).payload

if(!cached) {
    cached = (global as any).payload = {
        client: null,
        promise: null,
    }
}

interface Args {
    initOptions?: Partial<InitOptions>
}

export const getPayloadClient = async ({
    initOptions,
}: Args = {}): Promise<Payload> => {
    if(!process.env.PAYLOAD_SECRET) {
        throw new Error("PAYLOAD_SECRET is missing")
    }

    if(cached.client) {
        return cached.client
    }

    if(!cached.promise) {
        cached.promise = payload.init({
            email: {
                transport: transporter,
                fromAddress: "onboarding@resend.dev",
                fromName: "HippoHub",
            },
            secret: process.env.PAYLOAD_SECRET,
            local: initOptions?.express ? false : true,
            ...(initOptions || {}),
        })
    }

    try {
        cached.client = await cached.promise
    } catch (e: unknown) {
        cached.promise = null
        throw e
    }

    return cached.client
}