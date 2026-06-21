import { AssetType } from "@/types"

export default function LinkStatusBox({ assetType }: { assetType: AssetType }) {
    let color = ""
    let icon = ""
    let text = ""
    switch (assetType) {
        case AssetType.Show:
            color = "green-500/10"
            icon = "video_camera_front"
            text = "Linked to Series"
            break;
        case AssetType.Character:
            color = "green-500/10"
            icon = "person"
            text = "Linked to Character"
            break;
        case AssetType.Location:
            color = "green-500/10"
            icon = "landscape"
            text = "Linked to Environment"
            break;
        case AssetType.Episode:
            color = "green-500/10"
            icon = "video_camera_front"
            text = "Linked to Episode"
            break;
        case AssetType.Scene:
            color = "green-500/10"
            icon = "video_camera_front"
            text = "Linked to Scene"
            break;
        default:
            color = "green-500/10"
            icon = "video_camera_front"
            text = "Unlinked"
    }

    return (
        <span className={`flex flex-items items-center bg-${color} backdrop-blur-md border border-${color} text-${color}/80 px-2 py-1 rounded gap-1`}>
            <span className="material-symbols-outlined text-xs">{icon}</span>
            <span className="text-xs">{text}</span>

        </span>
    )
}