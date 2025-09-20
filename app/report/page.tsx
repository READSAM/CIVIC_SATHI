
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
// const API_BASE_URL = "https://stdrx3bg-5000.inc1.devtunnels.ms/";

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
//                 //     method: "POST",
//                 //     headers: { "Content-Type": "application/json" },
//                 //     body: JSON.stringify({ description: desc }),
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

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         // Check if required fields are filled before proceeding
//         if (!issueType || !location || !description) {
//             alert("Please fill in all required fields.");
//             return;
//         }
        
//         setIsSubmitting(true);

//         try {
//             console.log("Submitting report...");
            
//             // Step 1: Generate tags and department from the description
//             // This is the crucial part that ensures the data is ready before submission.
//             let generatedTags = "";
//             let assignedDepartment = "";
            
//             if (description.trim() !== "") {
//                 const tagsResponse = await fetch(`${API_BASE_URL}/api/generate-tags`, {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({ description: description }),
//                 });
                
//                 if (!tagsResponse.ok) {
//                     throw new Error(`Tag generation failed: ${tagsResponse.statusText}`);
//                 }
//                 const tagsData = await tagsResponse.json();
//                 generatedTags = tagsData.generated_tags;
                
//                 const departmentResponse = await fetch(`${API_BASE_URL}/api/assign-department`, {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({ tags: generatedTags }),
//                 });

//                 if (!departmentResponse.ok) {
//                     throw new Error(`Department assignment failed: ${departmentResponse.statusText}`);
//                 }
//                 const departmentData = await departmentResponse.json();
//                 assignedDepartment = departmentData.assigned_department;
//             }

//             // Step 2: Handle file uploads to Vercel Blob
//             let imageUrl = "";
//             if (selectedFile) {
//                 const formData = new FormData();
//                 formData.append('file', selectedFile);
//                 const response = await fetch('/api/upload', {
//                     method: 'POST',
//                     body: formData,
//                 });
//                 if (!response.ok) {
//                     const errorText = await response.text();
//                     throw new Error(`Image upload failed: ${response.status} ${response.statusText} - ${errorText}`);
//                 }
//                 const data = await response.json();
//                 imageUrl = data.url;
//                 console.log("Image uploaded to Vercel Blob:", imageUrl);
//             }

//             let uploadedAudioUrl = "";
//             if (audioBlob) {
//                 const formData = new FormData();
//                 formData.append('file', audioBlob, 'audio.webm');
//                 const response = await fetch('/api/upload', {
//                     method: 'POST',
//                     body: formData,
//                 });
//                 if (!response.ok) {
//                     const errorText = await response.text();
//                     throw new Error(`Audio upload failed: ${response.status} ${response.statusText} - ${errorText}`);
//                 }
//                 const data = await response.json();
//                 uploadedAudioUrl = data.url;
//                 console.log("Audio uploaded to Vercel Blob:", uploadedAudioUrl);
//             }

//             // Step 3: Save all collected data to Firestore
//             await addDoc(collection(db, "reports"), {
//                 type: issueType,
//                 location,
//                 description,
//                 image: imageUrl,
//                 audio: uploadedAudioUrl,
//                 tags: generatedTags, // Now guaranteed to be present
//                 assignedDepartment: assignedDepartment, // Now guaranteed to be present
//                 status: "pending",
//                 createdAt: serverTimestamp(),
//             });

//             console.log("Report submitted successfully ✅");
//             setIsSubmitted(true);
//         } catch (err) {
//             console.error("Error submitting report:", err);
//             alert("Something went wrong while submitting your report. Check the console for details.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

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

// firebase imports - only Firestore is needed
import { db } from "@/lib/firebaseconfig"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

// Add a base URL for your local Flask API
// const API_BASE_URL = "http://127.0.0.1:5000";
const API_BASE_URL = "https://stdrx3bg-5000.inc1.devtunnels.ms/";

export default function ReportIssuePage() {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    // Correctly declare state variables for file and audio blob
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)

    const [location, setLocation] = useState("")
    const [issueType, setIssueType] = useState("")
    const [description, setDescription] = useState("")
    const [displayTags, setDisplayTags] = useState("")
    const [isListening, setIsListening] = useState(false)
    const recognitionRef = useRef<any | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const [isRecording, setIsRecording] = useState(false)

    // Debounce function to prevent API calls on every keystroke
    const debounce = (func: Function, delay: number) => {
        let timeout: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    // Use a useEffect to call the tags API when the description changes
    useEffect(() => {
        const fetchTags = async (desc: string) => {
            if (desc.trim() === "") {
                setDisplayTags("");
                return;
            }
            try {
                // const tagsResponse = await fetch(`${API_BASE_URL}/api/generate-tags`, {
                //     method: "POST",
                //     headers: { "Content-Type": "application/json" },
                //     body: JSON.stringify({ description: desc }),
                // });
                const tagsResponse = await throttledFetch(`${API_BASE_URL}/api/generate-tags`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ description: desc }),
                });

    
                if (!tagsResponse.ok) {
                    throw new Error(`Tag generation failed: ${tagsResponse.statusText}`);
                }
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

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data)
                }
            }
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: "audio/webm" })
                setAudioBlob(blob)
                setAudioUrl(URL.createObjectURL(blob))
            }
            mediaRecorder.start()
            setIsRecording(true)
        } catch (err) {
            console.error("Error accessing microphone:", err)
        }
    }

    const stopRecording = () => {
        mediaRecorderRef.current?.stop()
        setIsRecording(false)
    }

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
                (position) => {
                    const { latitude, longitude } = position.coords
                    setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
                },
                (error) => {
                    console.error("Error getting location:", error)
                    setLocation("Location access denied")
                },
            )
        } else {
            setLocation("Geolocation not supported")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!issueType || !location || !description) {
            alert("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);

        try {
            console.log("Submitting report...");
            
            // Step 1: Use existing tags and get the assigned department
            let assignedDepartment = "";
            if (displayTags.trim() !== "") {
                const departmentResponse = await fetch(`${API_BASE_URL}/api/assign-department`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ tags: displayTags }), // Use the displayTags state
                });

                if (!departmentResponse.ok) {
                    throw new Error(`Department assignment failed: ${departmentResponse.statusText}`);
                }
                const departmentData = await departmentResponse.json();
                assignedDepartment = departmentData.assigned_department;
            }

            // Step 2: Handle file uploads to Vercel Blob
            let imageUrl = "";
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Image upload failed: ${response.status} ${response.statusText} - ${errorText}`);
                }
                const data = await response.json();
                imageUrl = data.url;
                console.log("Image uploaded to Vercel Blob:", imageUrl);
            }

            let uploadedAudioUrl = "";
            if (audioBlob) {
                const formData = new FormData();
                formData.append('file', audioBlob, 'audio.webm');
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Audio upload failed: ${response.status} ${response.statusText} - ${errorText}`);
                }
                const data = await response.json();
                uploadedAudioUrl = data.url;
                console.log("Audio uploaded to Vercel Blob:", uploadedAudioUrl);
            }

            // Step 3: Save all collected data to Firestore
            await addDoc(collection(db, "reports"), {
                type: issueType,
                location,
                description,
                image: imageUrl,
                audio: uploadedAudioUrl,
                tags: displayTags, // Use the displayTags state for consistency
                assignedDepartment: assignedDepartment, // Now guaranteed to be present
                status: "pending",
                createdAt: serverTimestamp(),
            });

            console.log("Report submitted successfully ✅");
            setIsSubmitted(true);
        } catch (err) {
            console.error("Error submitting report:", err);
            alert("Something went wrong while submitting your report. Check the console for details.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const startVoiceInput = () => {
        if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
            alert("Voice input is not supported in your browser. Please try Chrome or Safari.")
            return
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognition()

        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = "en-US"

        recognition.onstart = () => setIsListening(true)

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript))
            setIsListening(false)
        }

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error)
            setIsListening(false)
            if (event.error === "not-allowed") {
                alert("Microphone access denied. Please allow microphone access and try again.")
            } else {
                alert("Voice input failed. Please try again.")
            }
        }

        recognition.onend = () => setIsListening(false)

        recognitionRef.current = recognition
        recognition.start()
    }

    const stopVoiceInput = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
            setIsListening(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-background">
                <header className="bg-primary text-primary-foreground px-4 py-4">
                    <div className="max-w-md mx-auto flex items-center gap-3">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-xl font-semibold">Report Submitted</h1>
                    </div>
                </header>
                <main className="max-w-md mx-auto px-4 py-6 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                        <h2 className="text-2xl font-bold">Thank You!</h2>
                        <p className="text-muted-foreground">
                            Your report has been successfully submitted and will be reviewed shortly.
                        </p>
                        <Button onClick={() => setIsSubmitted(false)} className="mt-4">
                            Report Another Issue
                        </Button>
                        <Link href="/">
                            <Button variant="link">Go to Dashboard</Button>
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="bg-primary text-primary-foreground px-4 py-4">
                <div className="max-w-md mx-auto flex items-center gap-3">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-semibold">Report Issue</h1>
                </div>
            </header>

            <main className="max-w-md mx-auto px-4 py-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Camera className="h-5 w-5" />
                                Photo Evidence
                            </CardTitle>
                            <CardDescription>Take or upload a photo of the issue</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {selectedImage ? (
                                    <div className="relative">
                                        <img
                                            src={selectedImage || "/placeholder.svg"}
                                            alt="Selected issue"
                                            className="w-full h-48 object-cover rounded-lg border"
                                        />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            className="absolute top-2 right-2"
                                            onClick={() => {
                                                setSelectedImage(null)
                                                setSelectedFile(null)
                                            }}
                                        >
                                            Change
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground mb-4">No photo selected</p>
                                        <Label htmlFor="photo-upload" className="cursor-pointer">
                                            <Button type="button" variant="outline" asChild>
                                                <span>Choose Photo</span>
                                            </Button>
                                        </Label>
                                    </div>
                                )}
                                <Input
                                    id="photo-upload"
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handleImageUpload}
                                    className="sr-only"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Issue Type</CardTitle>
                            <CardDescription>What type of problem are you reporting?</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Select value={issueType} onValueChange={setIssueType} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select issue type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="streetlight">Broken Streetlight</SelectItem>
                                    <SelectItem value="electricpole">Electric Pole </SelectItem>
                                    <SelectItem value="waterleakage">Water Leakage </SelectItem>
                                    <SelectItem value="strayanimals">Stray Animals </SelectItem>
                                    <SelectItem value="pothole">Pothole</SelectItem>
                                    <SelectItem value="graffiti">Graffiti</SelectItem>
                                    <SelectItem value="trash">Illegal Dumping</SelectItem>
                                    <SelectItem value="sidewalk">Damaged Sidewalk</SelectItem>
                                    <SelectItem value="traffic">Traffic Signal Issue</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Location
                            </CardTitle>
                            <CardDescription>Where is this issue located?</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <Input
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Enter address or coordinates"
                                    required
                                />
                                <Button type="button" variant="outline" onClick={handleGetLocation} className="w-full bg-transparent">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Use Current Location
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                            <CardDescription>Provide details about the issue</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the issue in detail..."
                                    rows={4}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant={isListening ? "default" : "outline"}
                                    size="sm"
                                    onClick={isListening ? stopVoiceInput : startVoiceInput}
                                    className={isListening ? "bg-red-600 hover:bg-red-700" : ""}
                                >
                                    <Mic className={`h-4 w-4 mr-2 ${isListening ? "animate-pulse" : ""}`} />
                                    {isListening ? "Stop Voice Input" : "Voice Input"}
                                </Button>
                                <Button
                                    type="button"
                                    variant={isRecording ? "default" : "outline"}
                                    size="sm"
                                    onClick={isRecording ? stopRecording : startRecording}
                                    className={isRecording ? "bg-red-600 hover:bg-red-700" : ""}
                                >
                                    <Mic className={`h-4 w-4 mr-2 ${isRecording ? "animate-pulse" : ""}`} />
                                    {isRecording ? "Stop Audio Recording" : "Record Audio"}
                                </Button>
                                {audioUrl && (
                                    <div className="mt-2">
                                        <audio controls src={audioUrl} className="w-full" />
                                    </div>
                                )}
                                {isListening && (
                                    <p className="text-sm text-muted-foreground">🎤 Listening... Speak now to add to your description</p>
                                )}
                            </div>
                        </CardContent>
                        {displayTags && (
                            <CardContent>
                                <div className="mt-4">
                                    <p className="text-sm font-medium">Generated Tags:</p>
                                    <p className="text-sm text-muted-foreground">{displayTags}</p>
                                </div>
                            </CardContent>
                        )}
                    </Card>

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting || !issueType || !location || !description}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Report"}
                    </Button>
                </form>
            </main>
        </div>
    )
}