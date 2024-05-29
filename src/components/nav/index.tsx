'use client'

import { GoogleAuthProvider, User, getAuth, signInWithPopup } from "firebase/auth"
import { useEffect, useState } from "react"
import { ButtonGoogleSignIn } from "@/src/components/button-google-signin"
import { firebase } from "@/app/firebase"

const auth = getAuth(firebase)
const provider = new GoogleAuthProvider()

export function Nav() {
  const [user, setUser] = useState<User | null>()

  useEffect(() => {
    auth.onAuthStateChanged(onAuthStateChanged)
  }, [])

  function signIn() {
    signInWithPopup(auth, provider)
  }

  function signOut() {
    auth.signOut()
  }

  function onAuthStateChanged() {
    setUser(auth.currentUser)
  }

  return (
    <nav className="navbar bg-base-100">
      <div className="flex-1">
        <a href="/" className="btn btn-ghost text-xl">
          <span className="material-symbols-outlined">experiment</span>
        </a>
      </div>
      <div className="flex items-center gap-4">
        {user == null && (
          <ButtonGoogleSignIn onClick={signIn}/>
        )}
        {user != null && (
          <a href="app" className="tooltip tooltip-bottom" data-tip="Add app">
            <button className="btn btn-primary btn-circle w-10 h-10 min-h-10">
              <span className="material-symbols-outlined">add</span>
            </button>
          </a>
        )}
        {user?.photoURL && (
          <div className="relative">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={user.photoURL} />
                </div>
              </div>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li>
                  <a href="profile">
                    <span className="material-symbols-outlined">person</span>
                    Profile
                  </a>
                </li>
                <li>
                  <button onClick={signOut}>
                    <span className="material-symbols-outlined">logout</span>
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}