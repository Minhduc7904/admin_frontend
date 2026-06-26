import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Switch } from "../../../shared/components";
import {
    selectSwitchLessonVisibilityClassIds,
    switchCourseClassLessonVisibilityAsync,
} from "../../courseClass/store/courseClassSlice";

const getClassId = (courseClassLesson) =>
    courseClassLesson?.classId ?? courseClassLesson?.courseClassId ?? courseClassLesson?.courseClass?.classId;

const getClassName = (courseClassLesson) => {
    const courseClass = courseClassLesson?.courseClass || courseClassLesson?.class;
    const classId = getClassId(courseClassLesson);

    return (
        courseClass?.className ||
        courseClass?.name ||
        courseClassLesson?.className ||
        courseClassLesson?.name ||
        `Lớp #${classId}`
    );
};

const getClassMeta = (courseClassLesson) => {
    const courseClass = courseClassLesson?.courseClass || courseClassLesson?.class;

    return {
        weeklySchedule: courseClass?.weeklySchedule || courseClassLesson?.weeklySchedule,
        room: courseClass?.room || courseClassLesson?.room,
    };
};

const getResponseData = (payload) => payload?.data ?? payload;

const getCourseClassLessonRecord = (payload) => {
    const data = getResponseData(payload);
    return data?.courseClassLesson || data?.classLesson || data?.record || data;
};

export const LessonClassVisibilitySwitches = ({
    lessonId,
    courseClassLessons,
    maxHeightClassName = "max-h-80",
}) => {
    const dispatch = useDispatch();
    const loadingSwitchClassIds = useSelector(selectSwitchLessonVisibilityClassIds);
    const [visibilityOverrides, setVisibilityOverrides] = useState({});
    const items = (courseClassLessons || []).map((item) => {
        const classId = getClassId(item);
        const override = visibilityOverrides[`${lessonId}:${classId}`];

        return override ? { ...item, ...override } : item;
    });

    const handleClassVisibilityChange = async (courseClassLesson, checked) => {
        const classId = getClassId(courseClassLesson);
        if (!classId || !lessonId) return;

        try {
            const response = await dispatch(
                switchCourseClassLessonVisibilityAsync({
                    classId,
                    lessonId,
                    displayOrder: courseClassLesson.displayOrder,
                    isVisible: checked,
                })
            ).unwrap();
            const record = {
                ...courseClassLesson,
                classId,
                lessonId,
                isVisible: checked,
                ...getCourseClassLessonRecord(response),
            };

            setVisibilityOverrides((prev) => ({
                ...prev,
                [`${lessonId}:${classId}`]: record,
            }));
        } catch (error) {
            console.error("Error updating lesson visibility by class:", error);
        }
    };

    if (!lessonId) {
        return null;
    }

    return (
        <div className="border border-border rounded-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-gray-50">
                <p className="text-sm font-medium text-foreground">
                    Hiển thị theo lớp
                </p>
            </div>

            {items.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    Chưa có lớp học nào trong khóa này
                </div>
            ) : (
                <div className={`${maxHeightClassName} overflow-y-auto divide-y divide-border`}>
                    {items.map((courseClassLesson) => {
                        const classId = getClassId(courseClassLesson);
                        const checked = Boolean(courseClassLesson.isVisible);
                        const switchLoading = loadingSwitchClassIds.includes(classId);
                        const { weeklySchedule, room } = getClassMeta(courseClassLesson);

                        return (
                            <div
                                key={classId}
                                className="px-4 py-3 flex items-center justify-between gap-4"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {getClassName(courseClassLesson)}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                                        <span>#{classId}</span>
                                        {weeklySchedule && (
                                            <span>{weeklySchedule}</span>
                                        )}
                                        {room && (
                                            <span>Phòng {room}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <span className={`text-xs font-medium ${checked ? "text-blue-600" : "text-gray-500"}`}>
                                        {checked ? "Hiện" : "Ẩn"}
                                    </span>
                                    <Switch
                                        checked={checked}
                                        loading={switchLoading}
                                        disabled={switchLoading}
                                        onChange={(nextChecked) =>
                                            handleClassVisibilityChange(courseClassLesson, nextChecked)
                                        }
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
