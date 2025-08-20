import { useState } from "react";
import { Calendar as CalendarIcon, Cake, Clock, Calendar as CalendarIconSmall, Edit3, Stars } from "lucide-react";
import { format, differenceInYears, differenceInMonths, differenceInDays, startOfDay, isAfter } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface AgeResult {
  years: number;
  months: number;
  days: number;
}

interface ZodiacSign {
  name: string;
  symbol: string;
  element: string;
  dates: string;
}

export default function Index() {
  const [date, setDate] = useState<Date>();
  const [ageResult, setAgeResult] = useState<AgeResult | null>(null);
  const [zodiacSign, setZodiacSign] = useState<ZodiacSign | null>(null);
  const [error, setError] = useState<string>("");
  const [inputMethod, setInputMethod] = useState<"calendar" | "manual">("calendar");
  const [manualDay, setManualDay] = useState<string>("");
  const [manualMonth, setManualMonth] = useState<string>("");
  const [manualYear, setManualYear] = useState<string>("");

  const getZodiacSign = (birthDate: Date): ZodiacSign => {
    const month = birthDate.getMonth() + 1; // 1-12
    const day = birthDate.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
      return { name: "Aries", symbol: "♈", element: "Fire", dates: "Mar 21 - Apr 19" };
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
      return { name: "Taurus", symbol: "♉", element: "Earth", dates: "Apr 20 - May 20" };
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
      return { name: "Gemini", symbol: "♊", element: "Air", dates: "May 21 - Jun 20" };
    } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
      return { name: "Cancer", symbol: "♋", element: "Water", dates: "Jun 21 - Jul 22" };
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
      return { name: "Leo", symbol: "♌", element: "Fire", dates: "Jul 23 - Aug 22" };
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
      return { name: "Virgo", symbol: "♍", element: "Earth", dates: "Aug 23 - Sep 22" };
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
      return { name: "Libra", symbol: "♎", element: "Air", dates: "Sep 23 - Oct 22" };
    } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
      return { name: "Scorpio", symbol: "♏", element: "Water", dates: "Oct 23 - Nov 21" };
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
      return { name: "Sagittarius", symbol: "♐", element: "Fire", dates: "Nov 22 - Dec 21" };
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
      return { name: "Capricorn", symbol: "♑", element: "Earth", dates: "Dec 22 - Jan 19" };
    } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
      return { name: "Aquarius", symbol: "♒", element: "Air", dates: "Jan 20 - Feb 18" };
    } else {
      return { name: "Pisces", symbol: "♓", element: "Water", dates: "Feb 19 - Mar 20" };
    }
  };

  const calculateAge = () => {
    setError("");
    setAgeResult(null);
    setZodiacSign(null);

    let birthDate: Date;

    if (inputMethod === "calendar") {
      if (!date) {
        setError("Please select your date of birth");
        return;
      }
      birthDate = startOfDay(date);
    } else {
      // Manual input validation
      if (!manualDay || !manualMonth || !manualYear) {
        setError("Please enter day, month, and year");
        return;
      }

      const day = parseInt(manualDay);
      const month = parseInt(manualMonth) - 1; // JavaScript months are 0-indexed
      const year = parseInt(manualYear);

      if (day < 1 || day > 31 || month < 0 || month > 11 || year < 1900 || year > new Date().getFullYear()) {
        setError("Please enter a valid date");
        return;
      }

      birthDate = startOfDay(new Date(year, month, day));

      // Check if the date is valid (handles invalid dates like Feb 30)
      if (birthDate.getDate() !== day || birthDate.getMonth() !== month || birthDate.getFullYear() !== year) {
        setError("Please enter a valid date");
        return;
      }
    }

    const today = startOfDay(new Date());

    if (isAfter(birthDate, today)) {
      setError("Date of birth cannot be in the future");
      return;
    }

    // Calculate years
    const years = differenceInYears(today, birthDate);
    
    // Calculate remaining months after subtracting complete years
    const yearsPassed = new Date(birthDate);
    yearsPassed.setFullYear(yearsPassed.getFullYear() + years);
    const months = differenceInMonths(today, yearsPassed);
    
    // Calculate remaining days after subtracting complete years and months
    const monthsPassed = new Date(yearsPassed);
    monthsPassed.setMonth(monthsPassed.getMonth() + months);
    const days = differenceInDays(today, monthsPassed);

    setAgeResult({ years, months, days });
    setZodiacSign(getZodiacSign(birthDate));
  };

  const resetCalculator = () => {
    setDate(undefined);
    setAgeResult(null);
    setZodiacSign(null);
    setError("");
    setManualDay("");
    setManualMonth("");
    setManualYear("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <Cake className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Age Calculator</h1>
          <p className="text-gray-600">Discover your exact age in years, months, and days</p>
        </div>

        {/* Main Calculator Card */}
        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl text-gray-800">Calculate Your Age</CardTitle>
            <CardDescription className="text-gray-600">
              Select your date of birth to get started
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Input Method Toggle */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Choose Input Method</label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  type="button"
                  variant={inputMethod === "calendar" ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "flex-1 h-8",
                    inputMethod === "calendar"
                      ? "bg-white shadow-sm"
                      : "hover:bg-transparent"
                  )}
                  onClick={() => setInputMethod("calendar")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Calendar
                </Button>
                <Button
                  type="button"
                  variant={inputMethod === "manual" ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "flex-1 h-8",
                    inputMethod === "manual"
                      ? "bg-white shadow-sm"
                      : "hover:bg-transparent"
                  )}
                  onClick={() => setInputMethod("manual")}
                >
                  <Edit3 className="mr-2 h-4 w-4" />
                  Manual
                </Button>
              </div>
            </div>

            {/* Date Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date of Birth</label>

              {inputMethod === "calendar" ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 bg-white/80 hover:bg-white/90 border-gray-200",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 text-gray-500" />
                      {date ? format(date, "PPP") : "Pick your birth date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="center">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                      captionLayout="dropdown-buttons"
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Day</label>
                    <Select value={manualDay} onValueChange={setManualDay}>
                      <SelectTrigger className="h-12 bg-white/80">
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Month</label>
                    <Select value={manualMonth} onValueChange={setManualMonth}>
                      <SelectTrigger className="h-12 bg-white/80">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"
                        ].map((month, index) => (
                          <SelectItem key={index + 1} value={(index + 1).toString()}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Year</label>
                    <Input
                      type="number"
                      placeholder="Year"
                      value={manualYear}
                      onChange={(e) => setManualYear(e.target.value)}
                      min="1900"
                      max={new Date().getFullYear()}
                      className="h-12 bg-white/80"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            {/* Calculate Button */}
            <Button 
              onClick={calculateAge} 
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Clock className="mr-2 h-5 w-5" />
              Calculate My Age
            </Button>

            {/* Age Result */}
            {ageResult && (
              <div className="space-y-4 animate-in fade-in-50 duration-500">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Age</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                      <div className="text-2xl font-bold text-blue-700">{ageResult.years}</div>
                      <div className="text-xs text-blue-600 font-medium">Year{ageResult.years !== 1 ? 's' : ''}</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                      <div className="text-2xl font-bold text-purple-700">{ageResult.months}</div>
                      <div className="text-xs text-purple-600 font-medium">Month{ageResult.months !== 1 ? 's' : ''}</div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
                      <div className="text-2xl font-bold text-indigo-700">{ageResult.days}</div>
                      <div className="text-xs text-indigo-600 font-medium">Day{ageResult.days !== 1 ? 's' : ''}</div>
                    </div>
                  </div>
                  
                  {(date || (manualDay && manualMonth && manualYear)) && (
                    <p className="text-sm text-gray-600 mt-4">
                      Born on {inputMethod === "calendar" && date
                        ? format(date, "EEEE, MMMM do, yyyy")
                        : inputMethod === "manual" && manualDay && manualMonth && manualYear
                        ? format(new Date(parseInt(manualYear), parseInt(manualMonth) - 1, parseInt(manualDay)), "EEEE, MMMM do, yyyy")
                        : ""
                      }
                    </p>
                  )}
                </div>

                <Button 
                  onClick={resetCalculator}
                  variant="outline" 
                  className="w-full h-10 border-gray-200 hover:bg-gray-50"
                >
                  <CalendarIconSmall className="mr-2 h-4 w-4" />
                  Calculate Another Date
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Accurate age calculation down to the day
          </p>
        </div>
      </div>
    </div>
  );
}
