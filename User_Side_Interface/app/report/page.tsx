
"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Camera, MapPin, Upload, Mic, CheckCircle } from "lucide-react"
import Link from "next/link"
import { throttledFetch } from "@/lib/throttle"
import { useAuth } from "@/lib/AuthContext";


import { db } from "@/lib/firebaseconfig"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"


declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function ReportIssuePage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [location, setLocation] = useState("")
  const [issueType, setIssueType] = useState("")
  const [description, setDescription] = useState("")
  const [displayTags, setDisplayTags] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [autoDept, setAutoDept] = useState("");
  const recognitionRef = useRef<any>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const uploadInputRef = useRef<HTMLInputElement>(null); 
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const debounce = (func: Function, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  useEffect(() => {
    const fetchTags = async (desc: string) => {
      if (desc.trim() === "") {
        setDisplayTags("");
        return;
      }
      try {
        const tagsResponse = await throttledFetch(`/api/generate-tags`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: desc }),
        });
        if (!tagsResponse.ok) throw new Error("Tag gen failed");
        const tagsData = await tagsResponse.json();
        setDisplayTags(tagsData.generated_tags);
        if (tagsData.suggested_department) {
            console.log("⚡ Pre-fetched Department:", tagsData.suggested_department);
            setAutoDept(tagsData.suggested_department);
        }
      } catch (err) {
        console.error("Error generating tags:", err);
      }
    };
    const debouncedFetchTags = debounce(fetchTags, 500);
    debouncedFetchTags(description);
  }, [description]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => { if (event.data.size > 0) chunks.push(event.data) }
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
      }
      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) { console.error("Error accessing mic:", err) }
  }

  const stopRecording = () => { mediaRecorderRef.current?.stop(); setIsRecording(false) }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setSelectedImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => setLocation(`${p.coords.latitude.toFixed(6)}, ${p.coords.longitude.toFixed(6)}`),
        (e) => setLocation("Location access denied")
      )
    } else { setLocation("Geolocation not supported") }
  }
  
  const startVoiceInput = () => {
    if (typeof window !== "undefined") {
      if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
        alert("Voice input is not supported.")
        return
      }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = false; recognition.interimResults = false; recognition.lang = "en-US"
      recognition.onstart = () => setIsListening(true)
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript))
        setIsListening(false)
      }
      recognition.onerror = () => setIsListening(false)
      recognition.onend = () => setIsListening(false)
      recognitionRef.current = recognition
      recognition.start()
    }
  }

  const stopVoiceInput = () => { recognitionRef.current?.stop(); setIsListening(false) }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to submit a report.");
      return;
    }
    if (!issueType || !location || !description) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting report...");
      let assignedDepartment = ""; 
      
      if (autoDept) {
           console.log("⚡ Using Pre-fetched Department (Skipping 2nd API call):", autoDept);
           assignedDepartment = autoDept;
      } 
      else {
           try {
             const tagsToSend = displayTags && displayTags.length > 0 ? displayTags : `General Issue: ${description}`;
             
             console.log("🏢 STARTING Department Assignment (Fallback)...");
             const deptResponse = await fetch('/api/assign-department', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ tags: tagsToSend }),
             });
      
             if (deptResponse.ok) {
               const data = await deptResponse.json();
               console.log("Server replied:", data);
               if (data.suggested_department) {
                   assignedDepartment = data.suggested_department;
               } else if (typeof data === 'string') {
                   assignedDepartment = data;
               }
               console.log("Set Department to:", assignedDepartment);
             } else {
                console.error(" Server Error:", deptResponse.status);
             }
           } catch (deptError) {
             console.error("Network ERROR in Department Logic:", deptError);
           }
      }
      
      console.log("Final Department for Firebase:", assignedDepartment);

      let imageUrl = "";
      if (selectedFile) {
        console.log("Uploading image...");
        const formData = new FormData();
        formData.append('file', selectedFile); 
        formData.append('location', location)
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error("Image upload failed");
        
        const data = await response.json();
        imageUrl = data.url; 
        console.log("Image uploaded:", imageUrl);
      }

      let uploadedAudioUrl = "";
      if (audioBlob) {
        console.log("Uploading audio...");
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio-note.webm'); 

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error("Audio upload failed");
        
        const data = await response.json();
        uploadedAudioUrl = data.url;
        console.log("Audio uploaded:", uploadedAudioUrl);
      }
      await addDoc(collection(db, "reports"), {
        type: issueType,
        location,
        description,
        image: imageUrl,
        audio: uploadedAudioUrl,
        tags: displayTags, 
        assignedDepartment: assignedDepartment,
        status: "pending",
        createdAt: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email
      });

      console.log("Report submitted successfully ");
      setIsSubmitted(true);

    } catch (err) {
      console.error("Error submitting report:", err);
      alert("Something went wrong. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-green-50">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">Report Submitted!</CardTitle>
            <CardDescription>
              Thank you for being a Civic Sathi. Your report has been successfully recorded.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <Button variant="ghost" asChild className="mb-4 pl-0 hover:bg-transparent">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Report an Issue</CardTitle>
          <CardDescription>
            Help us improve our city by reporting infrastructure or civic issues and gain rewards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="issue-type">Issue Type</Label>
              <Select value={issueType} onValueChange={setIssueType}>
                <SelectTrigger id="issue-type">
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="road">Road Damage / Potholes</SelectItem>
                  <SelectItem value="garbage">Garbage / Sanitation</SelectItem>
                  <SelectItem value="water">Water Supply / Leakage</SelectItem>
                  <SelectItem value="electricity">Street Lights / Electricity</SelectItem>
                  <SelectItem value="traffic">Traffic / Parking</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex gap-2">
                <Input 
                  id="location" 
                  placeholder="Enter location or use GPS" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <Button type="button" variant="outline" size="icon" onClick={handleGetLocation}>
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <div className="relative">
                <Textarea 
                  id="description" 
                  placeholder="Describe the issue in detail..." 
                  className="min-h-[100px] pr-10"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="absolute right-2 bottom-2 flex gap-1">
                   <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${isListening ? "text-red-500 animate-pulse" : "text-muted-foreground"}`}
                    onClick={isListening ? stopVoiceInput : startVoiceInput}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {displayTags && (
                <div className="text-sm text-muted-foreground mt-1">
                   <span className="font-semibold">Detected Tags:</span> {displayTags}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Photo Evidence</Label>

              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={uploadInputRef} 
                onChange={handleImageUpload} 
              />
              <input 
                type="file" 
                accept="image/*"
                capture="environment" 
                className="hidden" 
                ref={cameraInputRef} 
                onChange={handleImageUpload} 
              />

              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 hover:bg-muted/50 transition-colors">
                {selectedImage ? (
                  <div className="relative w-full flex justify-center">
                    <img 
                      src={selectedImage} 
                      alt="Preview" 
                      className="max-h-[300px] object-contain rounded-md" 
                    />
<div className="mt-2 w-full max-w-[300px] p-2 bg-black/80 text-white rounded text-xs flex flex-col items-center text-center">
     <div className="flex items-center gap-1 font-bold">
        <span>📍</span> 
        <span>{location ? "GPS LOCKED" : "NO GPS"}</span>
     </div>
     <div className="opacity-80">
        {location ? location : "Please select location above"}
     </div>
</div>
                    <div className="absolute bottom-2 right-2 flex gap-2">
                       <Button
                        type="button" variant="secondary" size="sm"
                        onClick={() => { setSelectedImage(null); setSelectedFile(null); }}
                       >
                         Remove
                       </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="flex justify-center gap-4">
                      {/* Upload Button - Clicks the uploadInputRef */}
                      {/* <Button type="button" variant="outline" onClick={() => uploadInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </Button> */}

                      {/* Camera Button - Clicks the cameraInputRef */}
                      <Button type="button" variant="outline" onClick={() => cameraInputRef.current?.click()}>
                        <Camera className="mr-2 h-4 w-4" />
                        Camera
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Supported formats: JPG, PNG</p>
                  </div>
                )}
              </div>
            </div>
            

              
            {/* Audio Recording */}
            <div className="space-y-2">
               <Label>Audio Note (Optional)</Label>
               <div className="flex items-center gap-4">
                  {!isRecording && !audioUrl && (
                     <Button type="button" variant="outline" onClick={startRecording}>
                       <Mic className="mr-2 h-4 w-4" /> Record Audio
                     </Button>
                  )}
                  {isRecording && (
                     <Button type="button" variant="destructive" onClick={stopRecording}>
                       Stop Recording
                     </Button>
                  )}
                  {audioUrl && (
                    <div className="flex items-center gap-2 w-full">
                       <audio src={audioUrl} controls className="w-full h-10" />
                       <Button type="button" variant="ghost" size="icon" onClick={() => {
                          setAudioUrl(null)
                          setAudioBlob(null)
                       }}>
                         X
                       </Button>
                    </div>
                  )}
               </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
