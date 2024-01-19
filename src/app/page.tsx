import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import FileUpload from "@/components/FileUpload";


import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }

  return (
    <div className="relative w-screen min-h-screen ">

      <Image src={'/bg.svg'}
        alt=""
        width={1200}
        height={700}
        className="w-full h-screen absolute -z-10 object-cover"
      />
      <div className="nav w-full min-h-[3.5rem] bg-white/10 px-[6.2rem] flex justify-between items-center">
        <div className="">
          <Image src="/ExtractF.svg"
            alt="logo"
            width={100}
            height={30}
            className="" />
        </div>
        {isAuth && firstChat && (
          <div className="flex justify-center items-center gap-3 cursor-pointer">
            <span>
              <Link href={`/chat/${firstChat.id}`}>
                <Image src="/Dashboard.svg"
                  alt="logo"
                  width={80}
                  height={25}
                  className="" />
              </Link>
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        )}

      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-[2rem] font-bold leading-[3rem] mh">Enhanced Text Extractor</h1>

          </div>


          <p className=" text-xl font-medium leading-8 text-gray-50/80 max-w-[33.125rem] mt-[0.875rem] font-poppins">
            {"AI-powered PDF magic! Effortless text extraction for a smoother life. Say goodbye to manual hassle, hello to instant simplicity!"}
          </p>


          <div className="w-full mt-4">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href="/sign-in">
                <Button variant="trans" className="max-w-[20.625rem] py-5 px-6 text-white hover:text-white/80 transition-all duration-150 ease-in">
                  Login to get Started!
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
