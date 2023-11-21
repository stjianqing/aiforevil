import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import {Anti}


export default async function handler(
    req: NextApiRequest,
    res: NextResponse
  ) {
    const execSync = require('child_process').execSync
    const pythonProcess = execSync('python pages.')
  
    return res.json({ message: pythonProcess.toString() });
  }

  