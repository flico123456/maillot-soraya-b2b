
import Layout2 from "@/components/Layout2"
import Image from "next/image"
import Link from "next/link"

export default function Accueil() {

    return (
        <Layout2>
            <div>
                <div className="relative w-full">
                    <div className="relative w-full mt-12">
                        <div className="flex justify-center items-center cursor-pointer">
                            {/* Conteneur relatif pour l'image + overlay */}
                            <div className="relative w-full p-5">
                                {/* Image */}
                                <Image
                                    src="/SliderImage/Slider1.png"
                                    alt="Les journées privilèges"
                                    width={1920}
                                    height={900}
                                    quality={80}
                                    className="w-full h-[55vh] md:h-[70vh] object-cover rounded"
                                    priority
                                />

                                {/* Overlay texte aligné à gauche */}
                                <div className="absolute inset-0 z-10 flex flex-col items-start justify-center px-6 md:px-16 text-left">
                                    <h2 className="text-white font-inter text-xl md:text-4xl font-bold">
                                        Bienvenue sur la marketplace
                                    </h2>
                                    <p className="text-white font-inter text-xl md:text-2xl font-semibold mt-4">
                                        B2B Soraya Swimwear
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-center mt-10">
                            <h1 className="font-yanone text-2xl">Découvrez nos collections</h1>
                        </div>
                    </div>
                    <div className="flex flex-col items-center my-16 px-4">
                        <div
                            className="flex gap-8 w-full max-w-5xl mt-10 max-sm:flex-col max-sm:gap-4 max-sm:px-4 max-sm:items-center cursor-pointer"
                        >
                            <Link href="/collection-2026" className="flex flex-col items-center w-1/2 max-sm:w-full" style={{ flex: 1 }}>
                                <Image
                                    src="/cover-accueil/cover1.png"
                                    alt="Collection 2026"
                                    width={600}
                                    height={600}
                                    className="object-cover w-full max-sm:h-auto rounded"
                                />
                                <p className="mt-4 text-center text-gray-700 font-semibold">
                                    Collection 2026 - Soraya Swimwear
                                </p>
                            </Link>

                            <div className="flex flex-col items-center w-1/2 max-sm:w-full" style={{ flex: 1 }}>
                                <Image
                                    src="/cover-accueil/cover2.png"
                                    alt="Image 2"
                                    width={600}
                                    height={600}
                                    className="object-cover w-full max-sm:h-auto rounded"
                                />
                                <p className="mt-4 text-center text-gray-700 font-semibold">
                                    Collection 2025 - Soraya Swimwear
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout2>
    )
}