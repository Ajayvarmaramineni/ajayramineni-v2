"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";

// Placeholder photos — user can replace with real images in /public/images/photography/
const photos = [
  { id: 1, src: null, alt: "Street photography", aspect: "portrait" },
  { id: 2, src: null, alt: "Cityscape at dusk", aspect: "landscape" },
  { id: 3, src: null, alt: "Portrait", aspect: "portrait" },
  { id: 4, src: null, alt: "Architecture", aspect: "square" },
  { id: 5, src: null, alt: "Cinematic frame", aspect: "landscape" },
  { id: 6, src: null, alt: "Nature", aspect: "portrait" },
];

export default function PhotographyClient() {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="section-label mb-6"
          >
            Through the Lens
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-black uppercase text-[clamp(3rem,7vw,6rem)] leading-none"
            style={{ letterSpacing: "-0.03em" }}
          >
            FRAMES &<br />
            <span className="gradient-text-indigo">MOMENTS</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#71717a] text-lg mt-6 max-w-lg"
          >
            Data tells one kind of story. Photography tells another. Here are the
            frames that keep my visual thinking sharp.
          </motion.p>
        </div>

        {/* Photo grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`break-inside-avoid card-noir overflow-hidden group cursor-pointer ${
                photo.aspect === "portrait"
                  ? "aspect-[3/4]"
                  : photo.aspect === "landscape"
                  ? "aspect-[16/9]"
                  : "aspect-square"
              }`}
            >
              {/* Placeholder until real photos are added */}
              <div className="w-full h-full bg-[#111] flex flex-col items-center justify-center min-h-[200px] group-hover:bg-[#161616] transition-colors">
                <Camera
                  size={24}
                  className="text-[#333] mb-2 group-hover:text-[#6366f1] transition-colors"
                />
                <p className="font-mono text-xs text-[#333] group-hover:text-[#52525b] transition-colors">
                  {photo.alt}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 p-6 border border-[#222] rounded-xl bg-[#0d0d0d] text-center"
        >
          <Camera size={20} className="text-[#6366f1] mx-auto mb-3" />
          <p className="text-[#71717a] text-sm">
            Photos coming soon — add your images to{" "}
            <span className="font-mono text-[#6366f1]">
              /public/images/photography/
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
