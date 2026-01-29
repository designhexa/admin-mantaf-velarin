import { FC } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Plus, Unlock, Lock, FileText, X, Save, Trophy, RotateCcw, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { JuzSelector } from "@/components/JuzSelector";

// ================= TYPES =================

export interface TambahDrillProps {
  formHalaqohFilter: string;
  setFormHalaqohFilter: (v: string) => void;
  halaqohList: any[];
  selectedSantri: string;
  setSelectedSantri: (v: string) => void;
  filteredSantriForForm: any[];

  tanggalDrill?: Date;
  setTanggalDrill: (d?: Date) => void;

  juz: string;
  setJuz: (v: string) => void;

  drillLevel: string;
  handleDrillLevelChange: (v: string) => void;
  drillsForJuz: any[];
  isDrillUnlocked: (santriId: string, drillNumber: number, juz: number) => boolean;
  selectedDrill: any;

  isPageBased: boolean;
  manualDrills: any[];
  completedPages: number[];
  handleAddManualDrill: () => void;
  handleManualDrillChange: (id: string, field: string, value: number) => void;
  handleRemoveManualDrill: (id: string) => void;

  surahEntries: any[];
  surahByJuz: any[];
  handleAddSurahEntry: () => void;
  handleRemoveSurahEntry: (id: string) => void;
  handleSurahEntryChange: (id: string, field: string, value: any) => void;

  jumlahKesalahan: string;
  setJumlahKesalahan: (v: string) => void;
  nilaiKelancaran: number;
  BATAS_LULUS: number;
  BATAS_KESALAHAN: number;

  catatanTajwid: string;
  setCatatanTajwid: (v: string) => void;

  handleSaveDrill: () => void;
  handleLulusDrill: () => void;
  handleUlangiDrill: () => void;

  formatDrillDescription: (d: any) => string;
  CalendarComponent: any;
}

// ================= COMPONENT =================

const TambahDrill: FC<TambahDrillProps> = (props) => {
  const {
    formHalaqohFilter,
    setFormHalaqohFilter,
    halaqohList,
    selectedSantri,
    setSelectedSantri,
    filteredSantriForForm,
    tanggalDrill,
    setTanggalDrill,
    juz,
    setJuz,
    drillLevel,
    handleDrillLevelChange,
    drillsForJuz,
    isDrillUnlocked,
    selectedDrill,
    isPageBased,
    manualDrills,
    completedPages,
    handleAddManualDrill,
    handleManualDrillChange,
    handleRemoveManualDrill,
    surahEntries,
    surahByJuz,
    handleAddSurahEntry,
    handleRemoveSurahEntry,
    handleSurahEntryChange,
    jumlahKesalahan,
    setJumlahKesalahan,
    nilaiKelancaran,
    BATAS_LULUS,
    BATAS_KESALAHAN,
    catatanTajwid,
    setCatatanTajwid,
    handleSaveDrill,
    handleLulusDrill,
    handleUlangiDrill,
    formatDrillDescription,
    CalendarComponent,
  } = props;

  return (
    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Tambah Drill Hafalan</DialogTitle>
        <DialogDescription>
          Masukkan penilaian drill hafalan untuk santri
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {/* Filter Halaqoh */}
        <div className="space-y-2">
          <Label>Filter Halaqoh</Label>
          <Select
            value={formHalaqohFilter || "all"}
            onValueChange={(v) => setFormHalaqohFilter(v === "all" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Semua Halaqoh" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Halaqoh</SelectItem>
              {halaqohList.map((h) => (
                <SelectItem key={h.id} value={h.id}>
                  {h.nama_halaqoh}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Santri */}
        <div className="space-y-2">
          <Label>Pilih Santri *</Label>
          <Select value={selectedSantri} onValueChange={setSelectedSantri}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih santri" />
            </SelectTrigger>
            <SelectContent>
              {filteredSantriForForm.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.nama} ({s.nis})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tanggal */}
        <div className="space-y-2">
          <Label>Tanggal Drill *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !tanggalDrill && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {tanggalDrill ? format(tanggalDrill, "dd/MM/yyyy") : "Pilih tanggal"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={tanggalDrill}
                onSelect={setTanggalDrill}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <JuzSelector value={juz} onValueChange={setJuz} required />

        {/* Level Drill */}
        <div className="space-y-2">
          <Label>Level Drill</Label>
          <Select value={drillLevel} onValueChange={handleDrillLevelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih level drill" />
            </SelectTrigger>
            <SelectContent>
              {drillsForJuz.map((drill) => {
                const unlocked = selectedSantri
                  ? isDrillUnlocked(selectedSantri, drill.drillNumber, Number(juz))
                  : drill.drillNumber === 1;

                return (
                  <SelectItem
                    key={drill.drillNumber}
                    value={String(drill.drillNumber)}
                    disabled={!unlocked}
                  >
                    <span className="flex items-center gap-2">
                      {unlocked ? (
                        <Unlock className="w-3 h-3 text-green-500" />
                      ) : (
                        <Lock className="w-3 h-3 text-muted-foreground" />
                      )}
                      {drill.name}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Penilaian */}
        <div className="pt-4 border-t space-y-4">
          <h4 className="font-semibold">Penilaian</h4>

          <div className="space-y-2">
            <Label>Jumlah Kesalahan *</Label>
            <Input
              type="number"
              value={jumlahKesalahan}
              min={0}
              onChange={(e) => setJumlahKesalahan(e.target.value)}
            />
          </div>

          <div className="flex justify-between p-3 bg-muted rounded-lg">
            <Label>Nilai Kelancaran</Label>
            <span
              className={cn(
                "text-xl font-bold",
                nilaiKelancaran >= BATAS_LULUS ? "text-green-600" : "text-destructive"
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
            <div className="flex gap-3">
              {nilaiKelancaran >= BATAS_LULUS ? (
                <CheckCircle className="text-green-600" />
              ) : (
                <AlertCircle className="text-destructive" />
              )}
              <div className="text-sm">
                Batas lulus: {BATAS_LULUS} | Maks kesalahan: {BATAS_KESALAHAN}
              </div>
            </div>
          </Card>

          <div className="space-y-2">
            <Label>Catatan Tajwid</Label>
            <Textarea
              value={catatanTajwid}
              onChange={(e) => setCatatanTajwid(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2 pt-4">
          <Button variant="outline" onClick={handleSaveDrill}>
            <Save className="w-4 h-4 mr-1" /> Simpan
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            disabled={nilaiKelancaran < BATAS_LULUS}
            onClick={handleLulusDrill}
          >
            <Trophy className="w-4 h-4 mr-1" /> Lulus
          </Button>
          <Button variant="destructive" onClick={handleUlangiDrill}>
            <RotateCcw className="w-4 h-4 mr-1" /> Ulangi
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default TambahDrill;
