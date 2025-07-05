import React, { useEffect, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs.tsx";
import type { AssignedCourse } from "@/features/teacher/assignment/types.ts";

interface AssignedCoursesTabsProps {
  assignedCourses: AssignedCourse[];
}

export const AssignedCoursesTabs: React.FC<AssignedCoursesTabsProps> = ({
  assignedCourses,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(
    assignedCourses[0]?.id,
  );

  // Reset selection when courses array changes
  useEffect(() => {
    setSelectedCourseId(assignedCourses[0]?.id);
  }, [assignedCourses]);
  if (assignedCourses.length === 0) {
    return <p className="text-gray-600">No courses assigned.</p>;
  }

  return (
    <Tabs
      value={selectedCourseId}
      onValueChange={(val) => setSelectedCourseId(val)}
      className="w-full"
    >
      <TabsList>
        {assignedCourses.map((ac) => (
          <TabsTrigger key={ac.id} value={ac.id}>
            {ac.course.title}
          </TabsTrigger>
        ))}
      </TabsList>

      {assignedCourses.map((ac) => (
        <TabsContent key={ac.id} value={ac.id} className="p-4">
          <h4 className="text-lg font-semibold">{ac.course.title}</h4>
          {ac.course.description ? (
            <p className="text-gray-600 mt-2">{ac.course.description}</p>
          ) : (
            <p className="text-gray-600 italic mt-2">
              No description provided.
            </p>
          )}
          <p className="text-sm text-gray-500 mt-4">
            Added: {new Date(ac.addedAt).toLocaleDateString()}
          </p>
        </TabsContent>
      ))}
    </Tabs>
  );
};
