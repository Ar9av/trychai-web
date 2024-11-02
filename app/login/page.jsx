'use client'
import { Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import bg from '../../assets/bg.jpg'
import app from "@/config";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const Page = () => {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user)
            }
            else {
                setUser(null)
            }
        })
        return () => unsubscribe();
    }, [])

    const signInWithGoogle = async () => {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push('/create')
        }
        catch (error) {
            console.log("Error SignIn", error.message)
        }
    }
    return (
        <div>
            {
                user ? (
                    router.push('/create')
                )
                    :
                    (
                        <div
                            // style={{
                            //     backgroundImage: `url(${bg.src})`,
                            //     backgroundPosition: 'center',
                            //     backgroundSize: 'cover',
                            //     // opacity: 0.8
                            // }}
                            className="flex items-center justify-center min-h-screen">

                            <div className="w-[350px] p-6 bg-opacity-50 border-3 border-[#784e76] shadow-lg rounded-lg">
                                <h1 className="text-center text-3xl font-bold mb-6">TrychAI</h1>
                                <form>
                                    <div className="mb-4">
                                        <Input
                                            type="email"
                                            label="Email"
                                            variant="bordered"
                                            placeholder="Enter your email"
                                            defaultValue="example@email.org"
                                            className="max-w-xs"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <Input
                                            label="Password"
                                            variant="bordered"
                                            placeholder="Enter your password"
                                            type={isVisible ? "text" : "password"}
                                            className="max-w-xs"
                                        />
                                    </div>
                                    <div className="text-right mb-2">
                                        <a href="#" className="text-gray-400 hover:underline">Forgot Password?</a>
                                    </div>
                                    <Link href='create'>
                                        <button
                                            type="submit"
                                            className="w-full py-2 mb-4 text-white font-semibold delay-75 hover:-translate-y-1 transition ease-in-out bg-[#7083cf] hover:bg-[#784e76] rounded"
                                        >
                                            Sign In
                                        </button>
                                    </Link>
                                </form>
                                <div className="flex items-center my-4">
                                    <hr className="flex-grow border-t border-gray-300" />
                                    <span className="mx-4 text-gray-400">or</span>
                                    <hr className="flex-grow border-t border-gray-300" />
                                </div>
                                <button onClick={signInWithGoogle}
                                    type="button"
                                    className="w-full py-2 mb-2 text-black font-semibold bg-white delay-75 hover:-translate-y-1 transition ease-in-out rounded"
                                >
                                    Sign Up with Google
                                </button>
                                <button
                                    type="button"
                                    className="w-full py-2 mb-4 mt-2 text-white font-semibold bg-gray-800 delay-75 hover:-translate-y-1 transition ease-in-out rounded"
                                >
                                    Sign Up with GitHub
                                </button>

                            </div>
                        </div>
                    )
            }
        </div>
    );
};

export default Page;
