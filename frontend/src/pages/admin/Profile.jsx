import AdminNav from "../../components/AdminNav";

const Profile = () => {
    return (
      <>
  <AdminNav>
          <div className="flex justify-center items-center w-full">
            <div className="bg-white shadow-lg rounded-xl p-8 w-1/3">
              <h2 className="text-2xl font-semibold text-green-800 mb-6">Tài khoản</h2>
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img
                    src="https://via.placeholder.com/100"
                    alt="Profile"
                    className="rounded-full w-24 h-24"
                  />
                  <button className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full px-2 py-1 text-xs">Đổi</button>
                </div>
              </div>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    Tên Admin
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="username"
                    type="text"
                    placeholder="Nguyen Van A"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    placeholder="Email"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                    SĐT
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="phone"
                    type="text"
                    placeholder="09556789"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
          </AdminNav>
      </>
    );
  };
  
  export default Profile;
  