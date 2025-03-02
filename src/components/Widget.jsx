import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { MessageCircleIcon, StarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import tailwindStyles from "../index.css?inline";
import supabase from "../supabaseClient";

export const Widget = ({ projectId, popoverTheme = "light", buttonTheme = "dark" }) => {
  const [rating, setRating] = useState(3);
  const [submitted, setSubmitted] = useState(false);
  const [limitExceeded, setLimitExceeded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    checkFeedbackLimit();
  }, []);

  const checkFeedbackLimit = async () => {
    try {
      const { data, error } = await supabase.rpc("check_feedback_limit", { p_project_id: projectId });

      if (error) {
        setErrorMessage(`Error checking feedback limit: ${error.message}`);
        return;
      }

      if (data === true) setLimitExceeded(true);
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const onSelectStar = (index) => setRating(index + 1);

  const submit = async (e) => {
    e.preventDefault();
    if (limitExceeded) return;

    const form = e.target;
    const data = {
      p_project_id: projectId,
      p_user_name: form.name.value,
      p_user_email: form.email.value,
      p_message: form.feedback.value,
      p_rating: rating,
    };

    try {
      const { error } = await supabase.rpc("add_feedback", data);
      if (error) {
        setErrorMessage(`Submission failed: ${error.message}`);
      } else {
        setSubmitted(true);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred during submission.");
    }
  };

  return (
    <>
      <style>{tailwindStyles}</style>
      <div className="widget fixed bottom-4 right-4 z-50">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className={`rounded-full shadow-lg hover:scale-105 transition ${
                buttonTheme === "dark"
                  ? "bg-black text-white border border-gray-700"
                  : "bg-white text-black border border-gray-300"
              }`}
            >
              <MessageCircleIcon className="mr-2 h-5 w-5" />
              Feedback
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={`widget rounded-lg p-4 shadow-xl w-full max-w-md transition ${
              popoverTheme === "dark"
                ? "bg-black text-white border border-gray-700"
                : "bg-white text-black border border-gray-300"
            }`}
          >
            <style>{tailwindStyles}</style>
            {errorMessage ? (
              <div className="text-red-500 font-bold">{errorMessage}</div>
            ) : submitted ? (
              <div>
                <h3 className="text-lg font-bold">Thank you for your feedback!</h3>
                <p className="mt-4">We appreciate your feedback. It helps us improve our product.</p>
              </div>
            ) : limitExceeded ? (
              <div>
                <h3 className="text-lg font-bold text-red-500">Feedback Limit Reached</h3>
                <p className="mt-4">The creator has exceeded the feedback limit. Upgrade required.</p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold">Send us your feedback</h3>
                <form className="space-y-2" onSubmit={submit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        required
                        className={`${popoverTheme === "dark" ? "bg-gray-900 text-white" : ""}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        className={`${popoverTheme === "dark" ? "bg-gray-900 text-white" : ""}`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback</Label>
                    <Textarea
                      id="feedback"
                      placeholder="Tell us what you think"
                      className={`min-h-[100px] ${popoverTheme === "dark" ? "bg-gray-900 text-white" : ""}`}
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, index) => (
                        <StarIcon
                          key={index}
                          className={`h-5 w-5 cursor-pointer ${
                            rating > index
                              ? popoverTheme === "dark"
                                ? "fill-yellow-400"
                                : "fill-primary"
                              : "fill-muted stroke-muted-foreground"
                          }`}
                          onClick={() => onSelectStar(index)}
                        />
                      ))}
                    </div>
                    <Button
                      type="submit"
                      className={`transition ${
                        buttonTheme === "dark"
                          ? "bg-gray-900 text-white border border-gray-700"
                          : "bg-gray-200 text-black border border-gray-300"
                      }`}
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
            )}
            <Separator className="my-4" />
            <div className={`text-center ${popoverTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Powered by{" "}
              <a
                href="https://revoob.vercel.app/"
                target="_blank"
                className={`${popoverTheme === "dark" ? "text-blue-400" : "text-blue-500"} hover:underline`}
              >
                Revoob ⚡️
              </a>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};
