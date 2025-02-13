import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa"; 

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-10 px-6 text-gray-700">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start">
        
        {/* Colonna sinistra con progetto smartlagoon */}
        <div className="max-w-sm flex items-center space-x-4">
            <div>
                <h2 className="text-2xl font-bold text-blue-700">SMARTLAGOON</h2>
                <p className="mt-2 text-sm">
                    Innovative modelling approaches for predicting Socio-environMental
                    evolution in highly anthRopized coastal LAGOONS.
                </p>
            </div>
            <Image
                src="/images/euflag.png" 
                alt="EU Flag"
                width={114}
                height={80}
                className="mt-6"
            />
        </div>


        {/* Colonna destra con info progetto e mia mail*/}
        <div>
          <h3 className="text-lg font-semibold">DETAILS</h3>
          <ul className="mt-2 text-sm space-y-1">
            <li>
              <Link href="https://www.smartlagoon.eu/" className="hover:underline">
                https://www.smartlagoon.eu/
              </Link>
            </li>
            <li>
              Email:{" "}
              <a href="mailto:chiara.denardi2@studio.unibo.it" className="hover:underline">
                chiara.denardi2@studio.unibo.it
              </a>
            </li>
          </ul>

          {/*Loghi Social */}
          <div className="flex mt-4 space-x-4 text-gray-600 text-2xl">
            <Link href="https://www.facebook.com/smartlagoon.eu" target="_blank">
              <span className="hover:text-gray-900">
                <FaFacebook />
              </span>
            </Link>
            <Link href="https://x.com/SMARTLAGOON" target="_blank">
              <span className="hover:text-gray-900">
                <FaTwitter />
              </span>
            </Link>
            <Link href="https://www.linkedin.com/company/smartlagoon/" target="_blank">
                <span className="hover:text-gray-900">
                    <FaLinkedin />
                </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
