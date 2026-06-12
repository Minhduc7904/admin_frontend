import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

import { Switch } from "../../../shared/components";
import {
    getCourseClassesForLessonVisibilityAsync,
    selectLessonVisibilityClasses,
    selectLessonVisibilityClassesLoading,
    selectSwitchLessonVisibilityClassIds,
    switchCourseClassLessonVisibilityAsync,
} from "../../courseClass/store/courseClassSlice";

const getCourseClassLessonConfig = (courseClass, lessonId) => {
    const relationLists = [
        courseClass?.courseClassLessons,
        courseClass?.classLessons,
        courseClass?.lessonVisibilities,
    ].filter(Array.isArray);

    const directConfigs = [
        courseClass?.courseClassLesson,
        courseClass?.classLesson,
        courseClass?.lessonVisibility,
    ].filter(Boolean);

    const candidates = [
        ...directConfigs,
        ...relationLists.flat(),
    ];

    return candidates.find((item) => {
        const itemLessonId = item.lessonId ?? item.lesson?.lessonId;
        return Number(itemLessonId) === Number(lessonId);
    });
};

const isClassLessonVisible = (courseClass, lessonId) => {
    const config = getCourseClassLessonConfig(courseClass, lessonId);

    if (!config || config.isVisible === undefined || config.isVisible === null) {
        return true;
    }

    return Boolean(config.isVisible);
};

export const LessonClassVisibilitySwitches = ({
    courseId,
    lessonId,
    maxHeightClassName = "max-h-80",
}) => {
    const dispatch = useDispatch();
    const lessonVisibilityClasses = useSelector(selectLessonVisibilityClasses);
    const loadingLessonVisibilityClasses = useSelector(selectLessonVisibilityClassesLoading);
    const loadingSwitchClassIds = useSelector(selectSwitchLessonVisibilityClassIds);

    useEffect(() => {
        if (!courseId || !lessonId) return;

        dispatch(
            getCourseClassesForLessonVisibilityAsync({
                courseId,
            })
        );
    }, [dispatch, courseId, lessonId]);

    const handleClassVisibilityChange = async (courseClass, checked) => {
        try {
            await dispatch(
                switchCourseClassLessonVisibilityAsync({
                    classId: courseClass.classId,
                    lessonId,
                    isVisible: checked,
                })
            ).unwrap();
        } catch (error) {
            console.error("Error updating lesson visibility by class:", error);
        }
    };

    if (!courseId || !lessonId) {
        return null;
    }

    return (
        <div className="border border-border rounded-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-gray-50">
                <p className="text-sm font-medium text-foreground">
                    Hiển thị theo lớp
                </p>
            </div>

            {loadingLessonVisibilityClasses ? (
                <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang tải danh sách lớp...
                </div>
            ) : lessonVisibilityClasses.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    Chưa có lớp học nào trong khóa này
                </div>
            ) : (
                <div className={`${maxHeightClassName} overflow-y-auto divide-y divide-border`}>
                    {lessonVisibilityClasses.map((courseClass) => {
                        const checked = isClassLessonVisible(courseClass, lessonId);
                        const switchLoading = loadingSwitchClassIds.includes(courseClass.classId);

                        return (
                            <div
                                key={courseClass.classId}
                                className="px-4 py-3 flex items-center justify-between gap-4"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {courseClass.className || `Lớp #${courseClass.classId}`}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                                        <span>#{courseClass.classId}</span>
                                        {courseClass.weeklySchedule && (
                                            <span>{courseClass.weeklySchedule}</span>
                                        )}
                                        {courseClass.room && (
                                            <span>Phòng {courseClass.room}</span>
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
                                            handleClassVisibilityChange(courseClass, nextChecked)
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
