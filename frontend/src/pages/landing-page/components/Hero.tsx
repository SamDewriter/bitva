import React from "react";
import { motion } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";

export const Hero = () => (
  <section id="home" className="bg-[#24AFF2]/30 border-b border-slate-200">
    <div className="mx-auto max-w-6xl px-4 py-14 md:py-20 grid md:grid-cols-2 items-center gap-10">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900"
        >
          Unlock Your Crypto
          <br className="hidden md:block" />
          Potential with Bitva
        </motion.h1>
        <p className="mt-4 text-slate-600 max-w-xl">
          Trade, invest, and manage your cryptocurrencies securely and efficiently with our advanced platform.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/register">
            <Button className="bg-[#205FEA] hover:bg-[#1b4ed1] text-white">Get Started</Button>
          </Link>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="relative">
        <div className="hidden md:block">
          {/* <div className="flex items-center gap-2 text-slate-600">
            <Lock className="w-6 h-6" />
            <span className="font-medium">Secure Crypto Infrastructure</span>
          </div> */}
          <img
            src="../src/images/hero.png"
            alt="Hero"
            className="h-full w-full object-cover"
          />
        </div>
      </motion.div>
    </div>
  </section>
);