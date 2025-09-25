"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { IconButton, Avatar, TextField, Button } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon } from "@mui/icons-material";

export default function UpdateUserPage() {
  const [currUser, setCurrUser] = useState<any>(null);
const [editField, setEditField] = useState<string | null>(null);
const [fieldValue, setFieldValue] = useState("");

// Extract userId from token
const getUserIdFromToken = (token: string | undefined | null) => {
  if (!token) return null;
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
    return json.userId || json.id || null;
  } catch {
    return null;
  }
};

// Fetch user details once
useEffect(() => {
  const token = Cookies.get("token");
  const userId = getUserIdFromToken(token);
  if (!token || !userId) return;

  (async () => {
    try {
      const { data } = await axios.get<{ user: any }>(
        `http://localhost:4000/api/users/${userId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCurrUser(data.user || data); // store in currUser
    } catch (e) {
      console.error("Error fetching user:", e);
    }
  })();
}, []);

// Save updated field
const handleSave = async (field: string) => {
  try {
    const token = Cookies.get("token");
    const userId = getUserIdFromToken(token);
    if (!token || !userId) return;

    // optimistic update
    setCurrUser((prev: any) => ({ ...prev, [field]: fieldValue }));

    // persist in backend
    const res = await axios.patch<{ user: any }>(
      `http://localhost:4000/api/users/${userId}`,
      { [field]: fieldValue },
      { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
    );

    setCurrUser(res.data.user || res.data); // sync with backend response

    console.log("curr user:", currUser);
    setEditField(null);
    setFieldValue("");
  } catch (err) {
    console.error("Error updating user:", err);
  }
};


  // Delete account
  const handleDeleteAccount = async () => {
    const confirmDelete = confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      const token = Cookies.get("token");
      const userId = getUserIdFromToken(token);
      if(!token || !userId) return;
      await axios.delete(`http://localhost:4000/api/users/${userId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      Cookies.remove("token");
      alert("Account deleted");
      window.location.href = "/"; // redirect to home/login
    } catch (err) {
      console.error("Error deleting account:", err);
    }
  };

  if (!currUser) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Large image */}
        <div className="w-full">
          <div className="">
          <img
            src={
              currUser.profilePicture ||
              "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=1000&auto=format&fit=crop"
            }
            alt="Profile"
            className="w-[400px] h-[400px] rounded-full object-cover"
          />
          </div>
          <div className="mt-3 flex items-center gap-3">
            {editField === "profilePicture" ? (
              <>
                <TextField
                  value={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                  size="small"
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "white" },
                      "&:hover fieldset": { borderColor: "white" },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                    "& .MuiInputBase-input": {
                      color: "white", // make input text white
                    },
                    "& .MuiInputLabel-root": {
                      color: "white", // make label white
                    },
                  }}
                />

                <IconButton onClick={() => handleSave("profilePicture")}> <SaveIcon className="text-white"/> </IconButton>
              </>
            ) : (
              <>
                <span className="opacity-80">edit</span>
                <IconButton onClick={() => { setEditField("profilePicture"); setFieldValue(currUser.profilePicture || ""); }}>
                  <EditIcon className="text-white"/>
                </IconButton>
              </>
            )}
          </div>
        </div>

        {/* Right: Details with inline edit */}
        <div className="space-y-6 mt-15">
          {/* Username */}
          <div className="flex items-center gap-4">
          <div className="font-medium">{currUser.name}</div>
            {editField === "username" ? (
              <div className="flex items-center gap-2 flex-1">
                <TextField
                  value={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                  size="small"
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "white" },
                      "&:hover fieldset": { borderColor: "white" },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                    "& .MuiInputBase-input": {
                      color: "white", // make input text white
                    },
                    "& .MuiInputLabel-root": {
                      color: "white", // make label white
                    },
                  }}
                />

                <IconButton onClick={() => handleSave("username")}> <SaveIcon className="text-white" /> </IconButton>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <div className="font-medium">{currUser.username}</div>
                <IconButton onClick={() => { setEditField("username"); setFieldValue(currUser.username); }}>
                  <EditIcon className="text-white"/>
                </IconButton>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="flex items-center gap-4">
            <div className="w-32 text-2xl opacity-70">Email</div>
            {editField === "email" ? (
              <div className="flex items-center gap-2 flex-1">
                <TextField
                  value={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                  size="small"
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "white" },
                      "&:hover fieldset": { borderColor: "white" },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                    "& .MuiInputBase-input": {
                      color: "white", // make input text white
                    },
                    "& .MuiInputLabel-root": {
                      color: "white", // make label white
                    },
                  }}
                />

                <IconButton onClick={() => handleSave("email")}> <SaveIcon className="text-white" /> </IconButton>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <div className="font-medium">{currUser.email}</div>
                <IconButton onClick={() => { setEditField("email"); setFieldValue(currUser.email); }}>
                  <EditIcon className="text-white"/>
                </IconButton>
              </div>
            )}
          </div>

          {/* Password */}
          <div className="flex items-center gap-4">
            <div className="w-32 text-2xl opacity-70">Password</div>
            {editField === "password" ? (
              <div className="flex items-center gap-2 flex-1">
                <TextField
                  value={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                  size="small"
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "white" },
                      "&:hover fieldset": { borderColor: "white" },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                    "& .MuiInputBase-input": {
                      color: "white", // make input text white
                    },
                    "& .MuiInputLabel-root": {
                      color: "white", // make label white
                    },
                  }}
                />

                <IconButton onClick={() => handleSave("password")}> <SaveIcon className="text-white"/> </IconButton>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <div className="font-medium">********</div>
                <IconButton onClick={() => { setEditField("password"); setFieldValue(""); }}>
                  <EditIcon className="text-white"/>
                </IconButton>
              </div>
            )}
          </div>

          {/* Delete account */}
          <div className="pt-4">
            <Button variant="outlined" color="error" startIcon={<DeleteIcon className="text-white"/>} onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
