import { useEffect, useState } from "react"
import { Button } from "@/components/Button"
import { HUBSPOT_BLOG_FIELDS } from "@/constants"
import { isDefined } from "@/utils"
import { framer } from "framer-plugin"
import { useLoggingToggle } from "@/cms"
import { PageProps } from "@/router"
import { FieldMapper, ManagedCollectionFieldConfig } from "@/components/FieldMapper"
import { useSyncBlogsMutation } from "@/blog"

export default function Blog({ blogPluginContext }: PageProps) {
    useLoggingToggle()
    const [includedFieldIds, setIncludedFieldIds] = useState<Set<string>>(new Set())
    const [collectionFieldConfig, setCollectionFieldConfig] = useState<ManagedCollectionFieldConfig[]>([])
    const [fieldNameOverrides, setFieldNameOverrides] = useState<Record<string, string>>({})

    const { mutate: sync, isPending: isSyncing } = useSyncBlogsMutation({
        onError: e => framer.notify(e.message, { variant: "error" }),
        onSuccess: () => framer.closePlugin("Synchronization successful"),
    })

    useEffect(() => {
        if (!blogPluginContext) return

        const colFieldConfig: ManagedCollectionFieldConfig[] = HUBSPOT_BLOG_FIELDS.map(blogField => ({
            field: blogField,
            originalFieldName: blogField.name,
        }))

        const nameOverrides =
            blogPluginContext.type === "update"
                ? Object.fromEntries(blogPluginContext.collectionFields.map(field => [field.id, field.name]))
                : {}

        const includedFields = new Set(
            blogPluginContext.type === "update"
                ? blogPluginContext.includedFieldIds
                : HUBSPOT_BLOG_FIELDS.map(field => field.id)
        )

        setIncludedFieldIds(includedFields)
        setCollectionFieldConfig(colFieldConfig)
        setFieldNameOverrides(nameOverrides)
    }, [blogPluginContext])

    const handleFieldToggle = (fieldId: string) => {
        setIncludedFieldIds(current => {
            const nextSet = new Set(current)
            if (nextSet.has(fieldId)) {
                nextSet.delete(fieldId)
            } else {
                nextSet.add(fieldId)
            }
            return nextSet
        })
    }

    const handleFieldNameChange = (fieldId: string, value: string) => {
        setFieldNameOverrides(current => ({
            ...current,
            [fieldId]: value,
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const allFields = collectionFieldConfig
            .filter(fieldConfig => fieldConfig.field && includedFieldIds.has(fieldConfig.field.id))
            .map(fieldConfig => fieldConfig.field)
            .filter(isDefined)
            .map(field => {
                if (fieldNameOverrides[field.id]) {
                    field.name = fieldNameOverrides[field.id]
                }
                return field
            })

        sync({ includedFieldIds: Array.from(includedFieldIds), fields: allFields })
    }

    return (
        <form onSubmit={handleSubmit} className="h-full px-[15px] pb-[15px]">
            <FieldMapper
                collectionFieldConfig={collectionFieldConfig}
                fieldNameOverrides={fieldNameOverrides}
                isFieldSelected={fieldId => includedFieldIds.has(fieldId)}
                onFieldToggle={handleFieldToggle}
                onFieldNameChange={handleFieldNameChange}
                fromLabel="Blog Field"
                toLabel="Collection Field"
                className="pb-[15px]"
                height={365}
            />
            <div className="sticky left-0 bottom-0 flex justify-between bg-primary pt-[15px] border-t border-divider items-center max-w-full">
                <Button variant="secondary" className="w-full" isLoading={isSyncing}>
                    Import Blog
                </Button>
            </div>
        </form>
    )
}
