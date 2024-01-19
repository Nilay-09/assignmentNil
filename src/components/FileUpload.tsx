"use client";
import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Folder, Inbox, Loader2 } from "lucide-react";
import React, { useMemo } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";


import { useEffect, useState } from "react";

const FileUpload = () => {

    const router = useRouter();
    const [uploading, setUploading] = React.useState(false);
    const { mutate } = useMutation({
        mutationFn: async ({
            file_key,
            file_name,
        }: {
            file_key: string;
            file_name: string;
        }) => {
            const response = await axios.post("/api/create-chat", {
                file_key,
                file_name,
            });
            return response.data;
        },
    });

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file.size > 10 * 1024 * 1024) {
                // bigger than 10mb!
                toast.error("File too large");
                return;
            }

            try {
                setUploading(true);
                const data = await uploadToS3(file);
                console.log("meow", data);


                if (!data?.file_key || !data.file_name) {
                    toast.error("Something went wrong");
                    return;
                }
                mutate(data, {
                    onSuccess: ({ chat_id }) => {
                        toast.success("Chat created!");
                        console.log(data)
                        router.push(`/chat/${chat_id}`);
                    },
                    onError: (err) => {
                        toast.error("Error creating chat");
                        console.error(err);
                    },
                });
            } catch (error) {
                console.log(error);
            } finally {
                setUploading(false);
            }
        },

    });
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    return (
        <div className="p-2 rounded-xl">
            <div
                {...getRootProps({
                    className:
                        "rounded-xl cursor-pointer bg-white/20 py-8 flex justify-center items-center flex-col",
                })}
            >
                <input {...getInputProps()} />
                {uploading ? (
                    <>
                        {/* loading state */}
                        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                        <p className="mt-2 text-sm text-slate-400">
                            Spilling Tea to GPT...
                        </p>
                    </>
                ) : (
                    <>
                        <Folder className="w-10 h-10 text-white/80" />
                        <p className="mt-2 text-sm text-white/90">Drop PDF Here</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default FileUpload;