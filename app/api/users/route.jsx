import { db } from "@/config/FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { Timestamp } from "firebase/firestore";

export async function POST(req) {
  const { userEmail, userName } = await req.json();
  try {
    const docRef = doc(db, "users", userEmail);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return NextResponse.json(docSnap.data(), { status: 200 });
    } else {
      const data = {
        name: userName,
        email: userEmail,
        credits: 5,
        role: "member",
        createdAt: Timestamp.now(),
        status: "active",
      };
      await setDoc(doc(db, "users", userEmail), {
        ...data,
      });
      return NextResponse.json(data, { status: 200 });
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
