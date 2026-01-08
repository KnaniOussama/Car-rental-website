import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface CarFormValues {
  _id?: string
  brand: string
  model: string
  year: number
  price: number
  specifications: string // ✅ STRING in form state
  totalKilometers: number
  kilometersSinceLastMaintenance: number
  status: 'AVAILABLE' | 'RESERVED' | 'MAINTENANCE'
  image: string
}

interface CarFormProps {
  initialValues?: {
    _id?: string
    brand: string
    model: string
    year: number
    price: number
    specifications: string[]
    totalKilometers: number
    kilometersSinceLastMaintenance?: number
    status: 'AVAILABLE' | 'RESERVED' | 'MAINTENANCE'
    image?: string
  }
  onSubmit: (values: any) => void
  onCancel: () => void
  isEditMode: boolean
}

const EMPTY_FORM: CarFormValues = {
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  price: 0,
  specifications: '',
  totalKilometers: 0,
  kilometersSinceLastMaintenance: 0,
  status: 'AVAILABLE',
  image: '',
}

const CarForm: React.FC<CarFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isEditMode,
}) => {
  const [formValues, setFormValues] = useState<CarFormValues>(EMPTY_FORM)

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        ...EMPTY_FORM,
        ...initialValues,
        specifications: initialValues.specifications.join(', '),
        kilometersSinceLastMaintenance:
          initialValues.kilometersSinceLastMaintenance ?? 0,
        image: initialValues.image ?? '',
      })
    } else {
      setFormValues(EMPTY_FORM)
    }
  }, [initialValues])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target

    setFormValues((prev) => ({
      ...prev,
      [id]:
        id === 'year' ||
        id === 'price' ||
        id === 'totalKilometers' ||
        id === 'kilometersSinceLastMaintenance'
          ? Number(value)
          : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSubmit({
      ...formValues,
      specifications: formValues.specifications
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <FormRow label="Brand">
        <Input id="brand" value={formValues.brand} onChange={handleChange} />
      </FormRow>

      <FormRow label="Model">
        <Input id="model" value={formValues.model} onChange={handleChange} />
      </FormRow>

      <FormRow label="Year">
        <Input
          id="year"
          type="number"
          value={formValues.year}
          onChange={handleChange}
        />
      </FormRow>

      <FormRow label="Price (per day)">
        <Input
          id="price"
          type="number"
          value={formValues.price}
          onChange={handleChange}
        />
      </FormRow>

      <FormRow label="Specifications">
        <Textarea
          id="specifications"
          value={formValues.specifications}
          onChange={handleChange}
        />
      </FormRow>

      <FormRow label="Total Kilometers">
        <Input
          id="totalKilometers"
          type="number"
          value={formValues.totalKilometers}
          onChange={handleChange}
        />
      </FormRow>

      {isEditMode && (
        <FormRow label="KM Since Last Maint.">
          <Input
            id="kilometersSinceLastMaintenance"
            type="number"
            value={formValues.kilometersSinceLastMaintenance}
            onChange={handleChange}
          />
        </FormRow>
      )}

      <FormRow label="Status">
        <Select
          value={formValues.status}
          onValueChange={(v) =>
            setFormValues((p) => ({
              ...p,
              status: v as CarFormValues['status'],
            }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AVAILABLE">Available</SelectItem>
            <SelectItem value="RESERVED">Reserved</SelectItem>
            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </FormRow>

      <FormRow label="Image URL">
        <Input id="image" value={formValues.image} onChange={handleChange} />
      </FormRow>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditMode ? 'Save Changes' : 'Add Car'}
        </Button>
      </div>
    </form>
  )
}

const FormRow = ({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <Label className="text-right">{label}</Label>
    <div className="col-span-3">{children}</div>
  </div>
)

export default CarForm
