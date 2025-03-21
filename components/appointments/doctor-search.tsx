"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Mock data for doctors
export interface Doctor {
  id: string
  name: string
  specialty: string
  hospital: string
  rating: number
  availability: string
}

const mockDoctors: Doctor[] = [
  {
    id: "dr-1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    hospital: "Metro General Hospital",
    rating: 4.8,
    availability: "Mon, Wed, Fri",
  },
  {
    id: "dr-2",
    name: "Dr. Michael Chen",
    specialty: "Dermatology",
    hospital: "City Medical Center",
    rating: 4.7,
    availability: "Tue, Thu",
  },
  {
    id: "dr-3",
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    hospital: "Children's Hospital",
    rating: 4.9,
    availability: "Mon-Fri",
  },
  {
    id: "dr-4",
    name: "Dr. James Wilson",
    specialty: "Orthopedics",
    hospital: "Metro General Hospital",
    rating: 4.6,
    availability: "Mon, Wed, Thu",
  },
  {
    id: "dr-5",
    name: "Dr. Aisha Patel",
    specialty: "Neurology",
    hospital: "University Medical Center",
    rating: 4.9,
    availability: "Tue, Fri",
  },
  {
    id: "dr-6",
    name: "Dr. Robert Kim",
    specialty: "Family Medicine",
    hospital: "Community Health Clinic",
    rating: 4.7,
    availability: "Mon-Thu",
  },
  {
    id: "dr-7",
    name: "Dr. Lisa Thompson",
    specialty: "Gynecology",
    hospital: "Women's Health Center",
    rating: 4.8,
    availability: "Mon, Wed, Fri",
  },
  {
    id: "dr-8",
    name: "Dr. David Martinez",
    specialty: "Psychiatry",
    hospital: "Behavioral Health Institute",
    rating: 4.6,
    availability: "Tue, Thu",
  },
]

// Get unique specialties and hospitals for filters
const specialties = Array.from(new Set(mockDoctors.map((doctor) => doctor.specialty)))
const hospitals = Array.from(new Set(mockDoctors.map((doctor) => doctor.hospital)))

interface DoctorSearchProps {
  onDoctorSelect: (doctor: Doctor) => void
  selectedDoctor?: Doctor | null
}

export function DoctorSearch({ onDoctorSelect, selectedDoctor }: DoctorSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("")
  const [hospitalFilter, setHospitalFilter] = useState<string>("")
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(mockDoctors)

  // Apply filters when search term or filters change
  useEffect(() => {
    let results = mockDoctors

    // Filter by search term (doctor name)
    if (searchTerm) {
      results = results.filter((doctor) => doctor.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Filter by specialty
    if (specialtyFilter) {
      results = results.filter((doctor) => doctor.specialty === specialtyFilter)
    }

    // Filter by hospital
    if (hospitalFilter) {
      results = results.filter((doctor) => doctor.hospital === hospitalFilter)
    }

    setFilteredDoctors(results)
  }, [searchTerm, specialtyFilter, hospitalFilter])

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("")
    setSpecialtyFilter("")
    setHospitalFilter("")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search doctors by name..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" onClick={resetFilters}>
            Reset
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Select value={hospitalFilter} onValueChange={setHospitalFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Hospital" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hospitals</SelectItem>
                {hospitals.map((hospital) => (
                  <SelectItem key={hospital} value={hospital}>
                    {hospital}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No doctors found matching your criteria.</p>
          <Button variant="link" onClick={resetFilters}>
            Reset filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDoctors.map((doctor) => (
            <Card
              key={doctor.id}
              className={`cursor-pointer transition-all ${selectedDoctor?.id === doctor.id ? "ring-2 ring-primary" : "hover:bg-accent"}`}
              onClick={() => onDoctorSelect(doctor)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium">{doctor.name}</h3>
                    <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{doctor.hospital}</Badge>
                      <span className="text-sm">★ {doctor.rating}</span>
                    </div>
                    <p className="text-xs mt-1">Available: {doctor.availability}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

