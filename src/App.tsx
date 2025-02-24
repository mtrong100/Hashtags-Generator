import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { TValue } from "./types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function App() {
  // Define statess
  const [results, setResults] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<TValue>({
    title: "",
    platform: "Youtube",
    amount: 10,
  });

  // Handle generate hashtags
  const onGenerate = async () => {
    // Check if all fields are filled
    if (!value.title || !value.platform || value.amount === 0) {
      alert("Please fill all the fields");
      return;
    }

    setLoading(true);

    try {
      // Call the API endpoint
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
          import.meta.env.VITE_API_KEY
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Generate ${value.amount} highly relevant hashtags for the title: "${value.title}" specifically for the ${value.platform} platform. Include platform-specific trends and features, such as Reels for Facebook and Instagram, Shorts for YouTube, and Viral Challenges for TikTok. Ensure the hashtags are optimized for maximum visibility on ${value.platform}. Write them in raw text format, each on a new line without any numbering or extra text.
`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      // Extracting the hashtags text from the response
      if (
        data &&
        data.candidates &&
        data.candidates.length > 0 &&
        data.candidates[0].content.parts.length > 0
      ) {
        setResults(data.candidates[0].content.parts[0].text);
      } else {
        alert("No hashtags generated. Try again.");
      }
    } catch (error) {
      console.error("API Call Error:", error);
      alert("Failed to generate hashtags. Check the console for more details.");
    } finally {
      setLoading(false);
    }
  };

  // Handle copy text
  const handleCopyText = () => {
    if (results) {
      navigator.clipboard
        .writeText(results)
        .then(() => {
          alert("Text copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* Switch Theme */}
      <div className="fixed top-3 right-5">
        <span className="mr-3">Switch Theme</span>
        <ModeToggle />
      </div>

      {/* Main content */}
      <div>
        <h1 className="text-5xl font-bold text-center">Hashtags Generator</h1>

        <Card className="mt-10 w-[500px]">
          <CardHeader>
            <CardTitle>Auto Generate Hashtags</CardTitle>
            <CardDescription>Using Gemini AI API</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Form */}
            <section className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Example title"
                  onChange={(e) =>
                    setValue({ ...value, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Select a platform</Label>
                <Select
                  onValueChange={(e) => setValue({ ...value, platform: e })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Platforms</SelectLabel>
                      <SelectItem value="X">X</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Tiktok">Tiktok</SelectItem>
                      <SelectItem value="Youtube">Youtube</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount of hashtags</Label>
                <Input
                  type="number"
                  id="amount"
                  placeholder="10"
                  value={value.amount}
                  onChange={(e) =>
                    setValue({ ...value, amount: Number(e.target.value) })
                  }
                />
              </div>

              <Button
                onClick={onGenerate}
                className="w-full "
                size="lg"
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Hashtags"}
              </Button>
            </section>

            {/* Results */}
            <section className="mt-5">
              {results && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Results:</h3>
                  <p className=" opacity-90">{results}</p>
                  <Button
                    onClick={handleCopyText}
                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                    size="lg"
                  >
                    Copy
                  </Button>
                </div>
              )}
            </section>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
}

export default App;
