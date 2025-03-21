import { useMemo } from "react"
import { SelectItem } from "@/components/ui/select"
import { Clock } from "lucide-react"

interface TimeSlotPickerProps {
  selectedDate?: Date
  onTimeSelected: (time: string) => void
}

export function TimeSlotPicker({ selectedDate, onTimeSelected }: TimeSlotPickerProps) {
  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return []

    const slots = [
      "09:00 AM",
      "09:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "01:00 PM",
      "01:30 PM",
      "02:00 PM",
      "02:30 PM",
      "03:00 PM",
      "03:30 PM",
      "04:00 PM",
      "04:30 PM",
    ]

    const dayOfWeek = selectedDate.getDay()
    let availableSlots = [...slots]

    if (dayOfWeek === 1) {
      availableSlots = availableSlots.filter((slot) => !slot.includes("09:00") && !slot.includes("09:30"))
    } else if (dayOfWeek === 5) {
      availableSlots = availableSlots.filter((slot) => !slot.includes("04:00") && !slot.includes("04:30"))
    }

    return availableSlots
  }, [selectedDate])

  if (!selectedDate) {
    return <div className="p-2 text-sm text-muted-foreground">Please select a date first</div>
  }

  if (availableTimeSlots.length === 0) {
    return <div className="p-2 text-sm text-muted-foreground">No available time slots</div>
  }

  return (
    <div className="max-h-[300px] overflow-auto p-1">
      {availableTimeSlots.map((timeSlot) => (
        <SelectItem key={timeSlot} value={timeSlot} onClick={() => onTimeSelected(timeSlot)}>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            {timeSlot}
          </div>
        </SelectItem>
      ))}
    </div>
  )
}
