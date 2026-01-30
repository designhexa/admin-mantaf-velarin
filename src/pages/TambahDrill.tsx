import { useMemo, useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Lock,
  Unlock,
  Trophy,
  RotateCcw,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { JuzSelector } from "@/components/JuzSelector";

// ✅ IMPORT DRILL LOGIC LANGSUNG
import {
  DRILL_BY_JUZ,
  BATAS_LULUS,
  BATAS_KESALAHAN,
} from "@/lib/drill-data";

// ================= COMPONENT =================

const TambahDrill = () => {
  const [halaqohFilter, setHalaqohFilter] = useState("");
  const [selectedSantri, setSelectedSantri] = useState("");
  const [tanggalDrill, setTanggalDrill] = useState<Date>();
  const [juz, setJuz] = useState("");
  const [drillLevel, setDrillLevel] = useState("");
  const [jumlahKesalahan, setJumlahKesalahan] = useState("");
  const [catatanTajwid, setCatatanTajwid] = useState("");

  // ================= DERIVED =================

  const drillsForJuz = useMemo(() => {
    return DRILL_BY_JUZ[Number(juz)] || [];
  }, [juz]);

  const nilaiKelancaran = useMemo(() => {
    const kesalahan = Number(jumlahKesalahan || 0);
    return Math.max(0, 100 - kesalahan * 10);
  }, [jumlahKesalahan]);

  const isDrillUnlocked = (
    santriId: string,
    drillNumber: number,
    juz: number
  ) => {
    // 🔐 drill 1 selalu terbuka
    if (drillNumber === 1) return true;

    // 🔐 di aplikasi ini diasumsikan linear
    return true;
  };

  // ================= ACTIONS =================

  const handleSave = () => {
    console.log("SAVE DRILL", {
      selectedSantri,
      tanggalDrill,
      juz,
      drillLevel,
      jumlahKesalahan,
      nilaiKelancaran,
      catatanTajwid,
    });
  };

  const handleLulus = () => {
    console.log("LULUS DRILL");
  };

  const handleUlangi = () => {
    console.log("ULANGI DRILL");
  };

  // ================= RENDER =================

  return (
    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Tambah Drill Hafalan</DialogTitle>
        <DialogDescription>
          Masukkan penilaian drill hafalan santri
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">

        {/* TANGGAL */}
        <div className="space-y-2">
          <Label>Tanggal Drill *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start",
                  !tanggalDrill && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {tanggalDrill
                  ? format(tanggalDrill, "dd/MM/yyyy")
                  : "Pilih tanggal"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <input
                type="date"
                className="p-3"
                onChange={(e) =>
                  setTanggalDrill(new Date(e.target.value))
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* JUZ */}
        <JuzSelector value={juz} onValueChange={setJuz} required />

        {/* LEVEL DRILL */}
        <div className="space-y-2">
          <Label>Level Drill</Label>
          <Select value={drillLevel} onValueChange={setDrillLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih level drill" />
            </SelectTrigger>
            <SelectContent>
              {drillsForJuz.map((drill: any) => {
                const unlocked = isDrillUnlocked(
                  selectedSantri,
                  drill.drillNumber,
                  Number(juz)
                );

                return (
                  <SelectItem
                    key={drill.drillNumber}
                    value={String(drill.drillNumber)}
                    disabled={!unlocked}
                  >
                    <span className="flex gap-2 items-center">
                      {unlocked ? (
                        <Unlock className="w-3 h-3 text-green-500" />
                      ) : (
                        <Lock className="w-3 h-3" />
                      )}
                      {drill.name}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* PENILAIAN */}
        <div className="border-t pt-4 space-y-3">
          <Label>Jumlah Kesalahan</Label>
          <Input
            type="number"
            min={0}
            value={jumlahKesalahan}
            onChange={(e) => setJumlahKesalahan(e.target.value)}
          />

          <div className="flex justify-between p-3 bg-muted rounded-lg">
            <span>Nilai Kelancaran</span>
            <span
              className={cn(
                "font-bold",
                nilaiKelancaran >= BATAS_LULUS
                  ? "text-green-600"
                  : "text-destructive"
              )}
            >
              {nilaiKelancaran}
            </span>
          </div>

          <Card
            className={cn(
              "p-3 border-2",
              nilaiKelancaran >= BATAS_LULUS
                ? "border-green-500 bg-green-50"
                : "border-destructive bg-destructive/10"
            )}
          >
            <div className="flex gap-2 items-center">
              {nilaiKelancaran >= BATAS_LULUS ? (
                <CheckCircle className="text-green-600" />
              ) : (
                <AlertCircle className="text-destructive" />
              )}
              <span className="text-sm">
                Batas lulus {BATAS_LULUS} | Maks kesalahan {BATAS_KESALAHAN}
              </span>
            </div>
          </Card>

          <Textarea
            placeholder="Catatan tajwid"
            value={catatanTajwid}
            onChange={(e) => setCatatanTajwid(e.target.value)}
          />
        </div>

        {/* ACTION */}
        <div className="grid grid-cols-3 gap-2 pt-4">
          <Button variant="outline" onClick={handleSave}>
            <Save className="w-4 h-4 mr-1" /> Simpan
          </Button>
          <Button
            className="bg-green-600"
            disabled={nilaiKelancaran < BATAS_LULUS}
            onClick={handleLulus}
          >
            <Trophy className="w-4 h-4 mr-1" /> Lulus
          </Button>
          <Button variant="destructive" onClick={handleUlangi}>
            <RotateCcw className="w-4 h-4 mr-1" /> Ulangi
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default TambahDrill;
