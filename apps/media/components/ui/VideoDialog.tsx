"use client";

import { AnimatePresence, motion } from "motion/react";
import { XIcon } from "lucide-react";
import { useVideoDialog } from "./VideoDialogContext";

const VideoDialog = () => {
  const { isVideoOpen, videoUrl, closeVideo } = useVideoDialog();

  return (
    <AnimatePresence>
      {isVideoOpen && videoUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={closeVideo}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
        >
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative mx-4 aspect-video w-full max-w-4xl md:mx-0"
          >
            <motion.button
              onClick={closeVideo}
              className="absolute -top-16 right-0 rounded-full bg-neutral-900/50 p-2 text-xl text-white ring-1 backdrop-blur-md dark:bg-neutral-100/50 dark:text-black"
            >
              <XIcon className="size-5" />
            </motion.button>
            <div className="relative isolate z-[1] size-full overflow-hidden rounded-2xl border-2 border-white">
              <iframe
                src={videoUrl}
                className="size-full rounded-2xl"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              ></iframe>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoDialog;
