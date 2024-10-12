"use client";

import Image from 'next/image';
import { useActiveAccount } from "thirdweb/react";
import { LoginButton } from "./consts/LoginButton";
import { Button } from "@/components/ui/button";
import { PlayCircle, InfoIcon} from 'lucide-react';

export default function HomePage() { 
  const account = useActiveAccount();
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col relative">
     <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-20 backdrop-filter backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Image 
              src="https://wlupdutfisf3nqyc.public.blob.vercel-storage.com/LOGO%20(1)-Q9iNTo6kikGVQSocO1DOhyqFmxXvfp.png" 
              alt="Logo" 
              width={100} 
              height={100} 
            /> 
          </div>
          <div>
            <LoginButton />
          </div>
        </div>
      </div>
    </nav>

      <main className="flex-grow">
        <div className="relative h-[70vh] md:h-[80vh]">
          <Image
            src="https://wlupdutfisf3nqyc.public.blob.vercel-storage.com/giko%20bg-N7imn2VflOl3rnumXTp6yqtQ5tkzng.png"
            alt="The Queen's Gambit Hero"
            layout="fill"
            objectFit="cover"
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-2/3 lg:w-1/2 z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Giko's telescope : Ethereum (demo-apps)
            </h1>
            <p className="text-lg text-gray-300 mb-6">
            Giko, a brave but clumsy boy with an insatiable curiosity, is exploring the convenience of modern technology and brings it into the on-chain world of Ethereum. However, the Ethereum network is being infiltrated by malevolent aliens, and it's up to Giko to stop them before it's too late.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-200 px-8 py-3 text-lg font-semibold w-full sm:w-auto"
                  onClick={() => window.location.href = '/play'}
                >
                  <PlayCircle className="mr-2 h-5 w-5" /> Play
                </Button>
                
         
               <Button 
               size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-200 px-8 py-3 text-lg font-semibold w-full sm:w-auto">
                <InfoIcon className="mr-2 h-5 w-5" /> More Info
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
