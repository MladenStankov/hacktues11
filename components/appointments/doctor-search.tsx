"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { filters } from "../../app/actions/doctor-filter";
import { Doctor, User } from "@prisma/client";

interface DoctorSearchProps {
  onDoctorSelect: (doctor: Doctor & { user: User }) => void;
  selectedDoctor: (Doctor & { user: User }) | null;
}

type DoctorUser = Doctor & {
  user: User
  };

export function DoctorSearch({ onDoctorSelect, selectedDoctor }: DoctorSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("");
  const [hospitalFilter, setHospitalFilter] = useState<string>("");
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorUser[] | undefined>([]);
  const [hospitals, setHospitals] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const doctors = await filters({
        searchTerm,
        specialization: specialtyFilter,
        hospital: hospitalFilter,
      });

      setFilteredDoctors(doctors);

      // Extract unique hospitals & specializations
      const uniqueHospitals = Array.from(new Set(doctors?.map((doc) => doc.hospital).filter(Boolean))) as string[];
      const uniqueSpecialties = Array.from(new Set(doctors?.map((doc) => doc.specialization).filter(Boolean))) as string[];


      setHospitals(uniqueHospitals);
      setSpecialties(uniqueSpecialties);
    };

    fetchDoctors();
  }, [searchTerm, specialtyFilter, hospitalFilter]);

  const resetFilters = () => {
    setSearchTerm("");
    setSpecialtyFilter("");
    setHospitalFilter("");
  };

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
                {specialties.length > 0 ? (
                  specialties
                    .filter((specialty) => specialty && specialty.trim() !== "")
                    .map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem value="none" disabled>
                    No specialties found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Select value={hospitalFilter} onValueChange={setHospitalFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Hospital" />
              </SelectTrigger>
              <SelectContent>
                {hospitals.length > 0 ? (
                  hospitals
                    .filter((hospital) => hospital && hospital.trim() !== "")
                    .map((hospital) => (
                      <SelectItem key={hospital} value={hospital}>
                        {hospital}
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem value="none" disabled>
                    No hospitals found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredDoctors?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No doctors found matching your criteria.</p>
          <Button variant="link" onClick={resetFilters}>
            Reset filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDoctors?.map((doctor) => (
            <Card
              key={doctor.id}
              className={`cursor-pointer transition-all ${selectedDoctor?.id === doctor.id ? "ring-2 ring-primary" : "hover:bg-accent"}`}
              onClick={() => onDoctorSelect(doctor)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium">{doctor.user.name}</h3>
                    <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{doctor.hospital}</Badge>
                    </div>
                    <p className="text-xs mt-1">Available: test</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
