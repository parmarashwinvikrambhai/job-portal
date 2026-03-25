"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Building2, Globe, MapPin, Briefcase } from "lucide-react"

interface CompanyFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyToEdit?: any | null
  onSubmit: (companyData: any) => void
  initialName?: string
}

export function CompanyFormDialog({
  open,
  onOpenChange,
  companyToEdit,
  onSubmit,
  initialName = ""
}: CompanyFormDialogProps) {
  const [form, setForm] = useState({
    name: initialName,
    description: "",
    website: "",
    location: "",
    industry: "",
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    if (companyToEdit) {
      const initialForm = {
        name: companyToEdit.name || "",
        description: companyToEdit.description || "",
        website: companyToEdit.website || "",
        location: companyToEdit.location || "",
        industry: companyToEdit.industry || "",
      }
      setForm(initialForm)
      setLogoFile(null)
      setLogoPreview(companyToEdit.logo || null)
      setIsDirty(false)
    } else {
      setForm({
        name: initialName,
        description: "",
        website: "",
        location: "",
        industry: "",
      })
      setLogoFile(null)
      setLogoPreview(null)
      setIsDirty(false)
    }
  }, [companyToEdit, open, initialName])

  // Check for changes
  useEffect(() => {
    if (!open) return

    if (companyToEdit) {
      const hasFormChanged = 
        form.name !== (companyToEdit.name || "") ||
        form.description !== (companyToEdit.description || "") ||
        form.website !== (companyToEdit.website || "") ||
        form.location !== (companyToEdit.location || "") ||
        form.industry !== (companyToEdit.industry || "")
      
      setIsDirty(hasFormChanged || !!logoFile)
    } else {
      const hasFormChanged = 
        form.name !== initialName ||
        form.description !== "" ||
        form.website !== "" ||
        form.location !== "" ||
        form.industry !== ""
      
      setIsDirty(hasFormChanged || !!logoFile)
    }
  }, [form, logoFile, companyToEdit, initialName, open])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = new FormData()
    formData.append("name", form.name)
    formData.append("description", form.description)
    formData.append("website", form.website)
    formData.append("location", form.location)
    formData.append("industry", form.industry)
    if (logoFile) {
      formData.append("logo", logoFile)
    }
    
    onSubmit(formData)
    onOpenChange(false)
    setLogoFile(null) // Reset file for next open
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {companyToEdit ? "Update Company Profile" : "Register Your Company"}
          </DialogTitle>
          <DialogDescription>
            {companyToEdit
              ? "Change your company details here."
              : "Complete your company profile to start posting jobs."}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="h-24 w-24 rounded-xl border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted/50 group-hover:border-primary/50 transition-colors">
                {logoPreview ? (
                  <img src={logoPreview.startsWith('data:') || logoPreview.startsWith('http') ? logoPreview : `${process.env.NEXT_PUBLIC_API_URL}${logoPreview}`} alt="Logo preview" className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-10 w-10 text-muted-foreground/50" />
                )}
              </div>
              <Label
                htmlFor="logo-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-xl text-xs font-medium"
              >
                Change Logo
              </Label>
              <Input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="companyName"
                placeholder="e.g. Acme Corp"
                className="pl-10"
                value={form.name}
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Select
                  value={form.industry}
                  onValueChange={(value) => setForm({ ...form, industry: value })}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="e.g. New York, NY"
                  className="pl-10"
                  value={form.location}
                  required
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website URL</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="website"
                placeholder="https://example.com"
                className="pl-10"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">About Company</Label>
            <Textarea
              id="description"
              placeholder="Describe what your company does..."
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={!isDirty}>
              {companyToEdit ? "Save Changes" : "Register Company"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
