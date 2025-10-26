import Danhmuc from '../models/danhmuc.model.js'



export const layDanhMuc = async (req, res) => {
    try {
        const danhmuc = await Danhmuc.find();
        res.status(200).json(danhmuc);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.error("Error in layDanhMuc controller", error);
    }
};


export const themDanhMuc = async (req, res) => {
	try {
		const { tenDM } = req.body;


		const danhMuc_tonTai = await Danhmuc.findOne({ tenDM });
		if (danhMuc_tonTai) {
			return res.status(400).json({ error: "Danh mục này đã có rồi" });
		}


		const danhMucMoi = new Danhmuc({
			tenDM,
		});
		await danhMucMoi.save();

		
        return res.status(201).json(danhMucMoi);

	} catch (error) {
		console.log("Lỗi themDanhMuc controller", error.message);
		return res.status(500).json({ error: "Lỗi 500" });
	}
};

export const suaDanhMuc = async (req, res) => {
    const { tenDM } = req.body

    try{
        let danhmuc = await Danhmuc.findById(req.params.id)

        if(!danhmuc) return res.status(404).json({ message:"Không tìm thấy danh mục" })

            if (tenDM) danhmuc.tenDM = tenDM;

            danhmuc = await danhmuc.save()

            return res.status(200).json({danhmuc})
    } catch (error) {
        console.log("Lỗi suaDanhMuc controller", error.message)
        res.status(500).json({ error: error.message })
    }
}



export const xoaDanhMuc =async(req,res)=>{
    try{
        const danhmuc = await Danhmuc.findById(req.params.id)
        if(!danhmuc){
            return res.status(404).json({error: "Không tìm thấy danh mục để xóa"})
        }

        await Danhmuc.findByIdAndDelete(req.params.id)

        res.status(200).json({message:"Xóa danh mục thành công"})
    } catch(error){
        res.status(500).json({error: "Lỗi 500"})
        console.log("lỗi xoaDanhMuc controller",error)

    }
}

export const layTheoId = async (req, res) => {
    const { id } = req.params; 
    try {
        const danhmuc = await Danhmuc.findById(id);
        return res.status(200).json(danhmuc);
    } catch (error) {
        res.status(500).json({ error: "Lỗi 500" });
        console.log("Lỗi layTheoId controller", error.message);
    }
}