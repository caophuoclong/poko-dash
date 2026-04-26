import { Controller, useWatch } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import SelectField from './SelectField'
import { statusOptions, platformOptions, contentTypeOptions } from './constants'
import type { CalendarEvent } from '@/features/scheduler/types/calendar-event'
import CalendarDatePicker from '@/features/scheduler/components/calendar/calendar-date-picker'
import type {
  ContentPostCreateFormData,
  ContentPostEditFormData,
} from '#/features/posts/schemas/content-post.schema'
import { Button } from '#/components/ui/button'

interface CreatePreferenceContentProps {
  control: Control<ContentPostEditFormData | ContentPostCreateFormData>
  onCancel: () => void
  events?: CalendarEvent[]
}

export default function CreatePreferenceContent({
  control,
  onCancel,
  events = [],
}: CreatePreferenceContentProps) {
  const publishMode = useWatch({ control, name: 'publishMode' })
  return (
    <div className="lg:col-span-1">
      <div className="bg-surface border border-frost rounded-2xl p-6 space-y-6">
        <h3 className="font-semibold text-near-white">Thông tin bài viết</h3>

        <SelectField
          control={control}
          name="status"
          label="Trạng thái"
          options={statusOptions}
        />

        <SelectField
          control={control}
          name="platform"
          label="Nền tảng"
          options={platformOptions}
        />

        <SelectField
          control={control}
          name="contentType"
          label="Loại nội dung"
          options={contentTypeOptions}
        />

        <SelectField
          control={control}
          name="publishMode"
          label="Kiểu đăng"
          options={[
            { value: 'now', label: 'Đăng ngay' },
            { value: 'schedule', label: 'Lên lịch' },
          ]}
        />

        {publishMode === 'schedule' && (
          <>
            <div>
              <label
                htmlFor="scheduled_at"
                className="block text-sm text-near-white mb-2 font-medium"
              >
                Thời gian đăng
              </label>
              <Controller
                name="scheduledAt"
                control={control}
                render={({ field }) => (
                  <input
                    id="scheduled_at"
                    type="datetime-local"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    className="w-full bg-surface-2 border border-frost rounded-lg px-4 py-2.5 text-sm text-near-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm text-near-white mb-2 font-medium">
                Chọn ngày
              </label>
              <Controller
                name="scheduledAt"
                control={control}
                render={({ field }) => (
                  <CalendarDatePicker
                    value={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const currentTime = field.value
                          ? new Date(field.value)
                          : new Date()
                        date.setHours(currentTime.getHours())
                        date.setMinutes(currentTime.getMinutes())

                        const localDateTime = new Date(
                          date.getTime() - date.getTimezoneOffset() * 60000,
                        )
                          .toISOString()
                          .slice(0, 16)
                        field.onChange(localDateTime)
                      }
                    }}
                    events={events}
                    minDate={new Date()}
                  />
                )}
              />
            </div>
          </>
        )}

        <div className="pt-4 border-t border-frost space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onCancel}
          >
            Hủy bỏ
          </Button>
        </div>
      </div>
    </div>
  )
}
