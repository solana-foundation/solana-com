"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getDevelopersLearnDependentLessonKeys } from "@/utils/developers-learn-curriculum";

type StoredProgress = {
  completedLessons: string[];
  updatedAt: string;
};

const STORAGE_KEY = "solana:developers-learn:progress:v1";
const PROGRESS_UPDATED_EVENT = "developers-learn-progress-updated";

function readProgressFromStorage(): StoredProgress {
  if (typeof window === "undefined") {
    return { completedLessons: [], updatedAt: "" };
  }

  const rawProgress = window.localStorage.getItem(STORAGE_KEY);
  if (!rawProgress) {
    return { completedLessons: [], updatedAt: "" };
  }

  try {
    const parsedProgress = JSON.parse(rawProgress) as StoredProgress;
    if (!Array.isArray(parsedProgress.completedLessons)) {
      return { completedLessons: [], updatedAt: "" };
    }
    return {
      completedLessons: parsedProgress.completedLessons.filter(Boolean),
      updatedAt: parsedProgress.updatedAt || "",
    };
  } catch {
    return { completedLessons: [], updatedAt: "" };
  }
}

function writeProgressToStorage(completedLessons: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  const nextProgress: StoredProgress = {
    completedLessons,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProgress));
  window.dispatchEvent(new Event(PROGRESS_UPDATED_EVENT));
}

export function useDevelopersLearnProgress() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const syncProgress = () => {
      const progress = readProgressFromStorage();
      setCompletedLessons(progress.completedLessons);
      setIsHydrated(true);
    };

    syncProgress();

    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        syncProgress();
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(PROGRESS_UPDATED_EVENT, syncProgress);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(PROGRESS_UPDATED_EVENT, syncProgress);
    };
  }, []);

  const completedLessonsSet = useMemo(
    () => new Set(completedLessons),
    [completedLessons],
  );

  const markLessonComplete = useCallback((lessonKey: string) => {
    setCompletedLessons((previousLessons) => {
      if (previousLessons.includes(lessonKey)) {
        return previousLessons;
      }

      const nextLessons = [...previousLessons, lessonKey];
      writeProgressToStorage(nextLessons);
      return nextLessons;
    });
  }, []);

  const markLessonIncomplete = useCallback((lessonKey: string) => {
    setCompletedLessons((previousLessons) => {
      const [courseSlug, lessonSlug] = lessonKey.split("/");
      if (!courseSlug || !lessonSlug) {
        return previousLessons;
      }

      const dependentLessonKeys = getDevelopersLearnDependentLessonKeys(
        courseSlug,
        lessonSlug,
      );
      const dependentLessonKeySet = new Set(dependentLessonKeys);

      const nextLessons = previousLessons.filter(
        (existingLessonKey) => !dependentLessonKeySet.has(existingLessonKey),
      );

      if (nextLessons.length === previousLessons.length) {
        return previousLessons;
      }

      writeProgressToStorage(nextLessons);
      return nextLessons;
    });
  }, []);

  const clearProgress = useCallback(() => {
    setCompletedLessons([]);
    writeProgressToStorage([]);
  }, []);

  return {
    completedLessons,
    completedLessonsSet,
    isHydrated,
    isLessonCompleted: (lessonKey: string) => completedLessonsSet.has(lessonKey),
    markLessonComplete,
    markLessonIncomplete,
    clearProgress,
  };
}
