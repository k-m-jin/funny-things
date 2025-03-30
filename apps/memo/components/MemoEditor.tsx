"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { MemoFormData } from "@/types/memo";
import { v4 as uuidv4 } from "uuid";
import { useMemoStore } from "@/store/memoStore";
import { AlertModal } from "./AlertModal";

export default function MemoEditor() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const { register, handleSubmit, setValue, watch } = useForm<MemoFormData>({
    defaultValues: {
      content: "",
    },
  });

  const addMemo = useMemoStore((state) => state.addMemo);

  const startRecording = () => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setTranscript(transcript);
        setValue("content", transcript);
      };

      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      alert("음성 인식이 지원되지 않는 브라우저입니다.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const onSubmit = (data: MemoFormData) => {
    if (!data.content.trim()) return;

    const newMemo = {
      id: uuidv4(),
      content: data.content,
      createdAt: new Date(),
      updatedAt: new Date(),
      isVoiceRecorded: transcript.length > 0,
    };

    addMemo(newMemo);
    setValue("content", "");
    setTranscript("");
    setShowSaveAlert(true);
  };

  return (
    <div className="space-y-4 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Textarea
          {...register("content", { required: true })}
          placeholder="메모를 입력하세요..."
          className="min-h-[150px]"
        />
        <div className="flex space-x-2">
          <Button type="submit" disabled={!watch("content").trim()}>
            저장
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? "녹음 중지" : "음성 녹음"}
          </Button>
        </div>
      </form>

      <AlertModal
        isOpen={showSaveAlert}
        onClose={() => setShowSaveAlert(false)}
        message="메모가 저장되었습니다."
      />
    </div>
  );
}
