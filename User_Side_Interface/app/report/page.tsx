


// "use client"

// import type React from "react"
// import { useState, useRef, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { ArrowLeft, Camera, MapPin, Upload, Mic, CheckCircle } from "lucide-react"
// import Link from "next/link"
// import { throttledFetch } from "@/lib/throttle"

// // firebase imports - only Firestore is needed
// import { db } from "@/lib/firebaseconfig"
// import { collection, addDoc, serverTimestamp } from "firebase/firestore"

// // Add a base URL for your local Flask API
// // const API_BASE_URL = "http://127.0.0.1:5000";
// const API_BASE_URL = "https://civic-sathi-vi5b.onrender.com";

// export default function ReportIssuePage() {
//     const [isSubmitted, setIsSubmitted] = useState(false)
//     const [isSubmitting, setIsSubmitting] = useState(false)
//     const [selectedImage, setSelectedImage] = useState<string | null>(null)

//     // Correctly declare state variables for file and audio blob
//     const [selectedFile, setSelectedFile] = useState<File | null>(null)
//     const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
//     const [audioUrl, setAudioUrl] = useState<string | null>(null)

//     const [location, setLocation] = useState("")
//     const [issueType, setIssueType] = useState("")
//     const [description, setDescription] = useState("")
//     const [displayTags, setDisplayTags] = useState("")
//     const [debouncedDescription, setDebouncedDescription] = useState(description);
//     const [isListening, setIsListening] = useState(false)
//     const recognitionRef = useRef<any | null>(null)
//     const mediaRecorderRef = useRef<MediaRecorder | null>(null)
//     const [isRecording, setIsRecording] = useState(false)

//     // Debounce function to prevent API calls on every keystroke
//     const debounce = (func: Function, delay: number) => {
//         let timeout: NodeJS.Timeout;
//         return (...args: any[]) => {
//             clearTimeout(timeout);
//             timeout = setTimeout(() => func(...args), delay);
//         };
//     };

//     // Use a useEffect to call the tags API when the description changes
//     useEffect(() => {
//         const fetchTags = async (desc: string) => {
//             if (desc.trim() === "") {
//                 setDisplayTags("");
//                 return;
//             }
//             try {
//                 // const tagsResponse = await fetch(`${API_BASE_URL}/api/generate-tags`, {
//                 //     method: "POST",
//                 //     headers: { "Content-Type": "application/json" },
//                 //     body: JSON.stringify({ description: desc }),
//                 // });
//                 const tagsResponse = await throttledFetch(`${API_BASE_URL}/api/generate-tags`, {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ description: desc }),
//                 });

    
//                 if (!tagsResponse.ok) {
//                     throw new Error(`Tag generation failed: ${tagsResponse.statusText}`);
//                 }
//                 const tagsData = await tagsResponse.json();
//                 setDisplayTags(tagsData.generated_tags);
//             } catch (err) {
//                 console.error("Error generating tags:", err);
//             }
//         };

//         const debouncedFetchTags = debounce(fetchTags, 500);
//         debouncedFetchTags(description);
//     }, [description]);

//     const startRecording = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
//             const mediaRecorder = new MediaRecorder(stream)
//             mediaRecorderRef.current = mediaRecorder

//             const chunks: BlobPart[] = []

//             mediaRecorder.ondataavailable = (event) => {
//                 if (event.data.size > 0) {
//                     chunks.push(event.data)
//                 }
//             }
//             mediaRecorder.onstop = () => {
//                 const blob = new Blob(chunks, { type: "audio/webm" })
//                 setAudioBlob(blob)
//                 setAudioUrl(URL.createObjectURL(blob))
//             }
//             mediaRecorder.start()
//             setIsRecording(true)
//         } catch (err) {
//             console.error("Error accessing microphone:", err)
//         }
//     }

//     const stopRecording = () => {
//         mediaRecorderRef.current?.stop()
//         setIsRecording(false)
//     }

//     const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0]
//         if (file) {
//             setSelectedFile(file)
//             const reader = new FileReader()
//             reader.onload = (e) => setSelectedImage(e.target?.result as string)
//             reader.readAsDataURL(file)
//         }
//     }

//     const handleGetLocation = () => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const { latitude, longitude } = position.coords
//                     setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
//                 },
//                 (error) => {
//                     console.error("Error getting location:", error)
//                     setLocation("Location access denied")
//                 },
//             )
//         } else {
//             setLocation("Geolocation not supported")
//         }
//     }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!issueType || !location || !description) {
//       alert("Please fill in all required fields.");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       console.log("Submitting report...");

//       // --- STEP 1: SILENT DEPARTMENT ASSIGNMENT (Updated) ---
//       // Default to "General" if AI fails, so the user never gets stuck.
//       let assignedDepartment = "General Administration"; 

//       try{
//         const tagsToSend = displayTags && displayTags.length > 0 ? displayTags : `General Issue: ${description}`;

//         const deptResponse = await fetch(`${API_BASE_URL}/api/assign-department`,{
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             description: description, 
//             category: issueType,
//             tags: tagsToSend
//         }),
//        });

//         if (deptResponse.ok) {
//           const departmentData = await deptResponse.json();
//           // The API returns { department: "..." }
//           if (departmentData.department) {
//             assignedDepartment = departmentData.department;
//             console.log("AI silently assigned to:", assignedDepartment);
//           }
//         }
//       } catch (deptError) {
//         console.warn("Department assignment failed (using default):", deptError);
//         // We do NOT throw an error here. We let the submission continue 
//         // with "General Administration" so the user isn't blocked.
//       }

//       // --- STEP 2: IMAGE UPLOAD ---
//       let imageUrl = "";
//       if (selectedFile) {
//         const formData = new FormData();
//         formData.append('file', selectedFile);
//         const response = await fetch(`${API_BASE_URL}/api/upload`, {
//           method: 'POST',
//           body: formData,
//         });
//         if (!response.ok) {
//           throw new Error(`Image upload failed: ${response.statusText}`);
//         }
//         const data = await response.json();
//         imageUrl = data.url;
//         console.log("Image uploaded:", imageUrl);
//       }

//       // --- STEP 3: AUDIO UPLOAD ---
//       let uploadedAudioUrl = "";
//       if (audioBlob) {
//         const formData = new FormData();
//         formData.append('file', audioBlob, 'audio.webm');
//         const response = await fetch(`${API_BASE_URL}/api/upload`, {
//           method: 'POST',
//           body: formData,
//         });
//         if (!response.ok) {
//           throw new Error(`Audio upload failed: ${response.statusText}`);
//         }
//         const data = await response.json();
//         uploadedAudioUrl = data.url;
//         console.log("Audio uploaded:", uploadedAudioUrl);
//       }

//       // --- STEP 4: SAVE TO FIREBASE ---
//       await addDoc(collection(db, "reports"), {
//         type: issueType,
//         location,
//         description,
//         image: imageUrl,
//         audio: uploadedAudioUrl,
//         tags: displayTags, 
//         assignedDepartment: assignedDepartment, // <--- The AI result goes here
//         status: "pending",
//         createdAt: serverTimestamp(),
//       });

//       console.log("Report submitted successfully ✅");
//       setIsSubmitted(true);

//     } catch (err) {
//       console.error("Error submitting report:", err);
//       alert("Something went wrong. Please check your connection and try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//     const startVoiceInput = () => {
//         if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
//             alert("Voice input is not supported in your browser. Please try Chrome or Safari.")
//             return
//         }

//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
//         const recognition = new SpeechRecognition()

//         recognition.continuous = false
//         recognition.interimResults = false
//         recognition.lang = "en-US"

//         recognition.onstart = () => setIsListening(true)

//         recognition.onresult = (event: any) => {
//             const transcript = event.results[0][0].transcript
//             setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript))
//             setIsListening(false)
//         }

//         recognition.onerror = (event: any) => {
//             console.error("Speech recognition error:", event.error)
//             setIsListening(false)
//             if (event.error === "not-allowed") {
//                 alert("Microphone access denied. Please allow microphone access and try again.")
//             } else {
//                 alert("Voice input failed. Please try again.")
//             }
//         }

//         recognition.onend = () => setIsListening(false)

//         recognitionRef.current = recognition
//         recognition.start()
//     }

//     const stopVoiceInput = () => {
//         if (recognitionRef.current) {
//             recognitionRef.current.stop()
//             setIsListening(false)
//         }
//     }

//     if (isSubmitted) {
//         return (
//             <div className="min-h-screen bg-background">
//                 <header className="bg-primary text-primary-foreground px-4 py-4">
//                     <div className="max-w-md mx-auto flex items-center gap-3">
//                         <Link href="/">
//                             <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
//                                 <ArrowLeft className="h-4 w-4" />
//                             </Button>
//                         </Link>
//                         <h1 className="text-xl font-semibold">Report Submitted</h1>
//                     </div>
//                 </header>
//                 <main className="max-w-md mx-auto px-4 py-6 text-center">
//                     <div className="flex flex-col items-center justify-center space-y-4">
//                         <CheckCircle className="h-16 w-16 text-green-500" />
//                         <h2 className="text-2xl font-bold">Thank You!</h2>
//                         <p className="text-muted-foreground">
//                             Your report has been successfully submitted and will be reviewed shortly.
//                         </p>
//                         <Button onClick={() => setIsSubmitted(false)} className="mt-4">
//                             Report Another Issue
//                         </Button>
//                         <Link href="/">
//                             <Button variant="link">Go to Dashboard</Button>
//                         </Link>
//                     </div>
//                 </main>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-background">
//             <header className="bg-primary text-primary-foreground px-4 py-4">
//                 <div className="max-w-md mx-auto flex items-center gap-3">
//                     <Link href="/">
//                         <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
//                             <ArrowLeft className="h-4 w-4" />
//                         </Button>
//                     </Link>
//                     <h1 className="text-xl font-semibold">Report Issue</h1>
//                 </div>
//             </header>

//             <main className="max-w-md mx-auto px-4 py-6">
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <Card>
//                         <CardHeader>
//                             <CardTitle className="flex items-center gap-2">
//                                 <Camera className="h-5 w-5" />
//                                 Photo Evidence
//                             </CardTitle>
//                             <CardDescription>Take or upload a photo of the issue</CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="space-y-4">
//                                 {selectedImage ? (
//                                     <div className="relative">
//                                         <img
//                                             src={selectedImage || "/placeholder.svg"}
//                                             alt="Selected issue"
//                                             className="w-full h-48 object-cover rounded-lg border"
//                                         />
//                                         <Button
//                                             type="button"
//                                             variant="secondary"
//                                             size="sm"
//                                             className="absolute top-2 right-2"
//                                             onClick={() => {
//                                                 setSelectedImage(null)
//                                                 setSelectedFile(null)
//                                             }}
//                                         >
//                                             Change
//                                         </Button>
//                                     </div>
//                                 ) : (
//                                     <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
//                                         <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
//                                         <p className="text-sm text-muted-foreground mb-4">No photo selected</p>
//                                         <Label htmlFor="photo-upload" className="cursor-pointer">
//                                             <Button type="button" variant="outline" asChild>
//                                                 <span>Choose Photo</span>
//                                             </Button>
//                                         </Label>
//                                     </div>
//                                 )}
//                                 <Input
//                                     id="photo-upload"
//                                     type="file"
//                                     accept="image/*"
//                                     capture="environment"
//                                     onChange={handleImageUpload}
//                                     className="sr-only"
//                                 />
//                             </div>
//                         </CardContent>
//                     </Card>

//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Issue Type</CardTitle>
//                             <CardDescription>What type of problem are you reporting?</CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                             <Select value={issueType} onValueChange={setIssueType} required>
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select issue type" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="streetlight">Broken Streetlight</SelectItem>
//                                     <SelectItem value="electricpole">Electric Pole </SelectItem>
//                                     <SelectItem value="waterleakage">Water Leakage </SelectItem>
//                                     <SelectItem value="strayanimals">Stray Animals </SelectItem>
//                                     <SelectItem value="pothole">Pothole</SelectItem>
//                                     <SelectItem value="graffiti">Graffiti</SelectItem>
//                                     <SelectItem value="trash">Illegal Dumping</SelectItem>
//                                     <SelectItem value="sidewalk">Damaged Sidewalk</SelectItem>
//                                     <SelectItem value="traffic">Traffic Signal Issue</SelectItem>
//                                     <SelectItem value="other">Other</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </CardContent>
//                     </Card>

//                     <Card>
//                         <CardHeader>
//                             <CardTitle className="flex items-center gap-2">
//                                 <MapPin className="h-5 w-5" />
//                                 Location
//                             </CardTitle>
//                             <CardDescription>Where is this issue located?</CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="space-y-3">
//                                 <Input
//                                     value={location}
//                                     onChange={(e) => setLocation(e.target.value)}
//                                     placeholder="Enter address or coordinates"
//                                     required
//                                 />
//                                 <Button type="button" variant="outline" onClick={handleGetLocation} className="w-full bg-transparent">
//                                     <MapPin className="h-4 w-4 mr-2" />
//                                     Use Current Location
//                                 </Button>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Description</CardTitle>
//                             <CardDescription>Provide details about the issue</CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="space-y-3">
//                                 <Textarea
//                                     value={description}
//                                     onChange={(e) => setDescription(e.target.value)}
//                                     placeholder="Describe the issue in detail..."
//                                     rows={4}
//                                     required
//                                 />
//                                 <Button
//                                     type="button"
//                                     variant={isListening ? "default" : "outline"}
//                                     size="sm"
//                                     onClick={isListening ? stopVoiceInput : startVoiceInput}
//                                     className={isListening ? "bg-red-600 hover:bg-red-700" : ""}
//                                 >
//                                     <Mic className={`h-4 w-4 mr-2 ${isListening ? "animate-pulse" : ""}`} />
//                                     {isListening ? "Stop Voice Input" : "Voice Input"}
//                                 </Button>
//                                 <Button
//                                     type="button"
//                                     variant={isRecording ? "default" : "outline"}
//                                     size="sm"
//                                     onClick={isRecording ? stopRecording : startRecording}
//                                     className={isRecording ? "bg-red-600 hover:bg-red-700" : ""}
//                                 >
//                                     <Mic className={`h-4 w-4 mr-2 ${isRecording ? "animate-pulse" : ""}`} />
//                                     {isRecording ? "Stop Audio Recording" : "Record Audio"}
//                                 </Button>
//                                 {audioUrl && (
//                                     <div className="mt-2">
//                                         <audio controls src={audioUrl} className="w-full" />
//                                     </div>
//                                 )}
//                                 {isListening && (
//                                     <p className="text-sm text-muted-foreground">🎤 Listening... Speak now to add to your description</p>
//                                 )}
//                             </div>
//                         </CardContent>
//                         {displayTags && (
//                             <CardContent>
//                                 <div className="mt-4">
//                                     <p className="text-sm font-medium">Generated Tags:</p>
//                                     <p className="text-sm text-muted-foreground">{displayTags}</p>
//                                 </div>
//                             </CardContent>
//                         )}
//                     </Card>

//                     <Button
//                         type="submit"
//                         className="w-full"
//                         size="lg"
//                         disabled={isSubmitting || !issueType || !location || !description}
//                     >
//                         {isSubmitting ? "Submitting..." : "Submit Report"}
//                     </Button>
//                 </form>
//             </main>
//         </div>
//     )
// }
// // "use client";

// // import { useState, useRef } from "react";
// // import { Mic, Square, Upload, MapPin, Loader2, X } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Card, CardContent } from "@/components/ui/card";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // // --- FIREBASE IMPORTS ---
// // import { db, storage } from "@/lib/firebaseconfig"; // Using your correct config
// // import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// // import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// // const API_BASE_URL = "https://civic-sathi-vi5b.onrender.com"; // Your Render Backend

// // export default function ReportIssue() {
// //   const [isRecording, setIsRecording] = useState(false);
// //   const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
// //   const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
// //   const [recordingDuration, setRecordingDuration] = useState(0);
// //   const timerRef = useRef<NodeJS.Timeout | null>(null);

// //   const [location, setLocation] = useState("");
// //   const [description, setDescription] = useState("");
// //   const [issueType, setIssueType] = useState("");
// //   const [selectedFile, setSelectedFile] = useState<File | null>(null);
// //   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
// //   const [displayTags, setDisplayTags] = useState<string>("");

// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [isSubmitted, setIsSubmitted] = useState(false);
// //   const [isGeneratingTags, setIsGeneratingTags] = useState(false);

// //   // --- AUDIO RECORDING LOGIC ---
// //   const startRecording = async () => {
// //     try {
// //       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
// //       const recorder = new MediaRecorder(stream);
// //       const chunks: BlobPart[] = [];

// //       recorder.ondataavailable = (e) => chunks.push(e.data);
// //       recorder.onstop = () => {
// //         const blob = new Blob(chunks, { type: "audio/webm" });
// //         setAudioBlob(blob);
// //       };

// //       recorder.start();
// //       setMediaRecorder(recorder);
// //       setIsRecording(true);

// //       timerRef.current = setInterval(() => {
// //         setRecordingDuration((prev) => prev + 1);
// //       }, 1000);
// //     } catch (err) {
// //       console.error("Error accessing microphone:", err);
// //       alert("Microphone access is required to record audio.");
// //     }
// //   };

// //   const stopRecording = () => {
// //     if (mediaRecorder && isRecording) {
// //       mediaRecorder.stop();
// //       setIsRecording(false);
// //       if (timerRef.current) clearInterval(timerRef.current);
// //       setRecordingDuration(0);
// //       mediaRecorder.stream.getTracks().forEach((track) => track.stop());
// //     }
// //   };

// //   const formatDuration = (seconds: number) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins}:${secs.toString().padStart(2, "0")}`;
// //   };

// //   // --- FILE HANDLING ---
// //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     if (e.target.files && e.target.files[0]) {
// //       const file = e.target.files[0];
// //       setSelectedFile(file);
// //       setPreviewUrl(URL.createObjectURL(file));
// //     }
// //   };

// //   const removeFile = () => {
// //     setSelectedFile(null);
// //     setPreviewUrl(null);
// //   };

// //   // --- AI TAG GENERATION ---
// //   const handleGenerateTags = async () => {
// //     if (!description) return;
// //     setIsGeneratingTags(true);
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/api/generate-tags`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ description }),
// //       });
// //       const data = await response.json();
// //       if (data.generated_tags) {
// //         setDisplayTags(data.generated_tags);
// //       }
// //     } catch (error) {
// //       console.error("Error generating tags:", error);
// //     } finally {
// //       setIsGeneratingTags(false);
// //     }
// //   };

// //   // --- SUBMISSION HANDLER ---
// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();

// //     if (!issueType || !location || !description) {
// //       alert("Please fill in all required fields.");
// //       return;
// //     }

// //     setIsSubmitting(true);

// //     try {
// //       // 1. GENERATE TAGS/DEPARTMENT (Via Python Backend)
// //       let assignedDepartment = "General Administration";
// //       const tagsToSend = displayTags && displayTags.length > 0 ? displayTags : `General Issue: ${description}`;

// //       try {
// //         // Send request to Python backend just to get the department name
// //         const deptResponse = await fetch(`${API_BASE_URL}/api/assign-department`, {
// //           method: 'POST',
// //           headers: { 'Content-Type': 'application/json' },
// //           body: JSON.stringify({
// //             description: description,
// //             category: issueType,
// //             tags: tagsToSend
// //         }),
// //        });

// //         if (deptResponse.ok) {
// //           const departmentData = await deptResponse.json();
// //           if (departmentData.department) {
// //             assignedDepartment = departmentData.department;
// //           }
// //         }
// //       } catch (deptError) {
// //         console.warn("Department assignment failed, using default.");
// //       }

// //       // 2. UPLOAD IMAGE (Direct to Firebase Storage)
// //       let imageUrl = "";
// //       if (selectedFile) {
// //         // Create reference: reports/images/timestamp_filename
// //         const imageRef = ref(storage, `reports/images/${Date.now()}_${selectedFile.name}`);
// //         const snapshot = await uploadBytes(imageRef, selectedFile);
// //         imageUrl = await getDownloadURL(snapshot.ref);
// //       }

// //       // 3. UPLOAD AUDIO (Direct to Firebase Storage)
// //       let uploadedAudioUrl = "";
// //       if (audioBlob) {
// //         const audioRef = ref(storage, `reports/audio/${Date.now()}_voice_note.webm`);
// //         const snapshot = await uploadBytes(audioRef, audioBlob);
// //         uploadedAudioUrl = await getDownloadURL(snapshot.ref);
// //       }

// //       // 4. SAVE REPORT DATA (Direct to Firestore)
// //       await addDoc(collection(db, "reports"), {
// //         type: issueType,
// //         location,
// //         description,
// //         image: imageUrl,
// //         audio: uploadedAudioUrl,
// //         tags: tagsToSend,
// //         assignedDepartment: assignedDepartment,
// //         status: "pending",
// //         createdAt: serverTimestamp(),
// //       });

// //       setIsSubmitted(true);
// //     } catch (err) {
// //       console.error("Error submitting report:", err);
// //       alert("Error submitting report. See console for details.");
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   if (isSubmitted) {
// //     return (
// //       <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
// //         <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
// //           <Upload className="w-8 h-8 text-green-600" />
// //         </div>
// //         <h2 className="text-2xl font-bold text-gray-900 mb-2">
// //           Report Submitted Successfully!
// //         </h2>
// //         <p className="text-gray-600 mb-6">
// //           Thank you for being a responsible citizen. Your report ID has been
// //           generated and sent to the relevant department.
// //         </p>
// //         <Button
// //           onClick={() => {
// //             setIsSubmitted(false);
// //             setLocation("");
// //             setDescription("");
// //             setIssueType("");
// //             setSelectedFile(null);
// //             setPreviewUrl(null);
// //             setAudioBlob(null);
// //             setDisplayTags("");
// //           }}
// //         >
// //           Submit Another Report
// //         </Button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="max-w-2xl mx-auto p-6">
// //       <div className="mb-8">
// //         <h1 className="text-3xl font-bold text-gray-900">Report an Issue</h1>
// //         <p className="text-gray-600 mt-2">
// //           Help us improve our city by reporting civic issues in your area.
// //         </p>
// //       </div>

// //       <form onSubmit={handleSubmit} className="space-y-6">
// //         {/* Issue Type Selection */}
// //         <div className="space-y-2">
// //           <Label htmlFor="issue-type">Issue Type</Label>
// //           <Select value={issueType} onValueChange={setIssueType}>
// //             <SelectTrigger>
// //               <SelectValue placeholder="Select the type of issue" />
// //             </SelectTrigger>
// //             <SelectContent>
// //               <SelectItem value="sanitation">Sanitation & Garbage</SelectItem>
// //               <SelectItem value="roads">Roads & Potholes</SelectItem>
// //               <SelectItem value="water">Water Supply</SelectItem>
// //               <SelectItem value="electricity">Electricity & Street Lights</SelectItem>
// //               <SelectItem value="traffic">Traffic & Transport</SelectItem>
// //               <SelectItem value="other">Other</SelectItem>
// //             </SelectContent>
// //           </Select>
// //         </div>

// //         {/* Location Input */}
// //         <div className="space-y-2">
// //           <Label htmlFor="location">Location</Label>
// //           <div className="relative">
// //             <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
// //             <Input
// //               id="location"
// //               placeholder="Enter location or landmark"
// //               className="pl-10"
// //               value={location}
// //               onChange={(e) => setLocation(e.target.value)}
// //             />
// //           </div>
// //         </div>

// //         {/* Description Input */}
// //         <div className="space-y-2">
// //           <Label htmlFor="description">Description</Label>
// //           <Textarea
// //             id="description"
// //             placeholder="Describe the issue in detail..."
// //             className="min-h-[120px]"
// //             value={description}
// //             onChange={(e) => setDescription(e.target.value)}
// //             onBlur={handleGenerateTags} 
// //           />
// //           {isGeneratingTags && (
// //              <p className="text-sm text-blue-500 flex items-center gap-2">
// //                <Loader2 className="h-3 w-3 animate-spin"/> Generating AI tags...
// //              </p>
// //           )}
// //           {displayTags && (
// //              <div className="mt-2">
// //                 <span className="text-xs font-semibold text-gray-500 uppercase">Detected Tags: </span>
// //                 <span className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">{displayTags}</span>
// //              </div>
// //           )}
// //         </div>

// //         {/* Image Upload */}
// //         <div className="space-y-2">
// //           <Label>Evidence (Photo)</Label>
// //           <Card className="border-dashed">
// //             <CardContent className="flex flex-col items-center justify-center py-6">
// //               {previewUrl ? (
// //                 <div className="relative w-full">
// //                   <img
// //                     src={previewUrl}
// //                     alt="Preview"
// //                     className="w-full h-48 object-cover rounded-md"
// //                   />
// //                   <Button
// //                     type="button"
// //                     variant="destructive"
// //                     size="icon"
// //                     className="absolute top-2 right-2 rounded-full"
// //                     onClick={removeFile}
// //                   >
// //                     <X className="h-4 w-4" />
// //                   </Button>
// //                 </div>
// //               ) : (
// //                 <>
// //                   <Upload className="h-10 w-10 text-gray-400 mb-2" />
// //                   <p className="text-sm text-gray-500 mb-2">
// //                     Click to upload or drag and drop
// //                   </p>
// //                   <Input
// //                     type="file"
// //                     accept="image/*"
// //                     className="hidden"
// //                     id="file-upload"
// //                     onChange={handleFileChange}
// //                   />
// //                   <Button
// //                     type="button"
// //                     variant="outline"
// //                     onClick={() => document.getElementById("file-upload")?.click()}
// //                   >
// //                     Select Photo
// //                   </Button>
// //                 </>
// //               )}
// //             </CardContent>
// //           </Card>
// //         </div>

// //         {/* Audio Recording */}
// //         <div className="space-y-2">
// //           <Label>Voice Note (Optional)</Label>
// //           <div className="flex items-center gap-4">
// //             {!isRecording ? (
// //               <Button
// //                 type="button"
// //                 variant={audioBlob ? "secondary" : "outline"}
// //                 className="w-full justify-start gap-2"
// //                 onClick={startRecording}
// //               >
// //                 <Mic className="h-4 w-4" />
// //                 {audioBlob ? "Record Again" : "Start Recording"}
// //               </Button>
// //             ) : (
// //               <Button
// //                 type="button"
// //                 variant="destructive"
// //                 className="w-full justify-start gap-2 animate-pulse"
// //                 onClick={stopRecording}
// //               >
// //                 <Square className="h-4 w-4" />
// //                 Stop Recording ({formatDuration(recordingDuration)})
// //               </Button>
// //             )}
// //           </div>
// //           {audioBlob && !isRecording && (
// //             <p className="text-sm text-green-600 flex items-center gap-2">
// //               ✓ Audio recorded ready to submit
// //             </p>
// //           )}
// //         </div>

// //         {/* Submit Button */}
// //         <Button
// //           type="submit"
// //           className="w-full"
// //           size="lg"
// //           disabled={isSubmitting}
// //         >
// //           {isSubmitting ? (
// //             <>
// //               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //               Submitting...
// //             </>
// //           ) : (
// //             "Submit Report"
// //           )}
// //         </Button>
// //       </form>
// //     </div>
// //   );
// // }


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


// firebase imports
import { db } from "@/lib/firebaseconfig"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

// Base URL for API (Used ONLY for tags and department assignment)
const API_BASE_URL = "https://civic-sathi-vi5b.onrender.com";

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
  const recognitionRef = useRef<any>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const uploadInputRef = useRef<HTMLInputElement>(null); // For the Upload button
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  // --- Helper Functions (Debounce, etc.) ---
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
        const tagsResponse = await throttledFetch(`${API_BASE_URL}/api/generate-tags`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: desc }),
        });
        if (!tagsResponse.ok) throw new Error("Tag gen failed");
        const tagsData = await tagsResponse.json();
        setDisplayTags(tagsData.generated_tags);
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


  // --- MAIN SUBMIT FUNCTION ---
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

      // 1. Department Assignment (AI)
      // ... inside handleSubmit ...

      // 1. Department Assignment
      let assignedDepartment = "General Administration"; 
      
      try {
        // Fallback: If tags are empty, use the description so the AI still has something to work with
        const tagsToSend = displayTags && displayTags.length > 0 ? displayTags : `General Issue: ${description}`;
        
        // LOGS: If you don't see this in the browser console, the code isn't deployed yet!
        console.log("🏢 STARTING Department Assignment...");
        console.log("👉 Fetching URL: /api/assign-department");
        console.log("📦 Sending Data:", JSON.stringify({ tags: tagsToSend }));

        // CORRECT URL based on your file path
        const deptResponse = await fetch('/api/assign-department', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tags: tagsToSend }),
        });

        if (deptResponse.ok) {
          const data = await deptResponse.json();
          console.log("✅ SUCCESS! Server replied:", data);
          
          if (data.department) {
             assignedDepartment = data.department;
             console.log("🎯 Set Department to:", assignedDepartment);
          }
        } else {
          // If the path is wrong, this will print 404
          console.error("❌ ERROR: Server returned status:", deptResponse.status);
        }

      } catch (deptError) {
        console.error("💥 CRITICAL ERROR in Department Logic:", deptError);
      }
      
      console.log("🏁 Final Department for Firebase:", assignedDepartment);

      // ... rest of the function (Image upload, etc.) ...

      // 2. IMAGE UPLOAD (To your /api/upload route)
      let imageUrl = "";
      if (selectedFile) {
        console.log("Uploading image...");
        const formData = new FormData();
        formData.append('file', selectedFile); 
        
        // Note: Using standard fetch to your Next.js API route
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error("Image upload failed");
        
        const data = await response.json();
        imageUrl = data.url; // Vercel Blob returns the 'url' property
        console.log("Image uploaded:", imageUrl);
      }

      // 3. AUDIO UPLOAD (To your /api/upload route)
      let uploadedAudioUrl = "";
      if (audioBlob) {
        console.log("Uploading audio...");
        const formData = new FormData();
        // Give the file a name so the API can read it
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

      // 4. SAVE TO FIREBASE
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

      console.log("Report submitted successfully ✅");
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
            Help us improve our city by reporting infrastructure or civic issues.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Issue Type */}
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

            {/* Location */}
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

            {/* Description */}
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

             {/* Image Upload */}
             {/* --- PHOTO EVIDENCE SECTION (Fixed Camera) --- */}
            <div className="space-y-2">
              <Label>Photo Evidence</Label>
              
              {/* Hidden Input 1: Regular Upload (Gallery) */}
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={uploadInputRef} 
                onChange={handleImageUpload} 
              />

              {/* Hidden Input 2: Camera Force (Rear Camera) */}
              <input 
                type="file" 
                accept="image/*"
                capture="environment" // <--- This does the magic on mobile
                className="hidden" 
                ref={cameraInputRef} 
                onChange={handleImageUpload} 
              />

              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 hover:bg-muted/50 transition-colors">
                {selectedImage ? (
                  // IMAGE PREVIEW STATE
                  <div className="relative w-full flex justify-center">
                    <img 
                      src={selectedImage} 
                      alt="Preview" 
                      className="max-h-[300px] object-contain rounded-md" 
                    />
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
                  // EMPTY STATE (Buttons)
                  <div className="text-center space-y-2">
                    <div className="flex justify-center gap-4">
                      {/* Upload Button - Clicks the uploadInputRef */}
                      <Button type="button" variant="outline" onClick={() => uploadInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </Button>

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
