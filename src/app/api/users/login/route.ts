import {connect} from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect()

export async function POST(request:NextRequest){
  try {
    const reqBody = await request.json();
    const {email, password} = reqBody;
    console.log(reqBody)

    // check if user exist
    const user = await User.findOne({email})
    if(!user){
      return NextResponse.json({error:"User not exist"}, {status:400})
    }

    const validPass = await bcryptjs.compare(password, user.password);
    if(!validPass){
      return NextResponse.json({error:"Invalid Password"}, {status:400})
    }
    //creating token data
    const tokenData = {
      id : user._id,
      username: user.username,
      email: user.email,
    }
    //creating tokem
    const token = await jwt.sign(tokenData,process.env.TOKEN_SECRET!, {expiresIn:"1d"});

    const res = NextResponse.json({
      message:"Login Successful",
      success: true,
    })
    res.cookies.set("token", token, {
      httpOnly: true,
    })
    return res;

  } catch (error:any) {
      return NextResponse.json({error:error.message}, {status : 500});
  }
}