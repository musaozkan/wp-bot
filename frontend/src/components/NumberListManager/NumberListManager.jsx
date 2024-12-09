import React, { useState, useEffect } from "react";
import CreateNumberListModal from "./CreateNumberListModal";
import NumberListManagerModal from "./NumberListManagerModal";
import {
  getNumbersLists,
  createNumbersList,
  deleteNumbersList,
  getNumbers,
  removeNumberFromList,
  addNumberToList,
} from "../../services/NumberService";

function NumberListManager() {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    getNumbersLists().then((res) => setLists(res.data?.lists || []));
  }, []);

  const handleCreateList = async (name, nums) => {
    await createNumbersList(name, nums);
    setLists((prev) => [...prev, name]);
    setShowCreateModal(false);
  };

  const handleDeleteList = async (name) => {
    await deleteNumbersList(name);
    setLists((prev) => prev.filter((list) => list !== name));
  };

  const handleEditList = async (name) => {
    setSelectedList(name);
    const res = await getNumbers(name);
    setNumbers(res.data?.numbers || []);
  };

  return (
    <div className="p-4 bg-light rounded shadow">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>İletişim Listeleri</h2>
        <button
          className="btn btn-success"
          onClick={() => setShowCreateModal(true)}
        >
          + Yeni Liste
        </button>
      </div>
      <ul className="list-group">
        {lists.map((list) => (
          <li
            key={list}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {list}
            <div>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => handleEditList(list)}
              >
                Düzenle
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDeleteList(list)}
              >
                Sil
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showCreateModal && (
        <CreateNumberListModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateList}
        />
      )}
      {selectedList && (
        <NumberListManagerModal
          selectedList={selectedList}
          numbers={numbers}
          onClose={() => setSelectedList(null)}
          onRemove={async (num) => {
            await removeNumberFromList(selectedList, num);
            setNumbers((prev) => prev.filter((n) => n !== num));
          }}
          onAdd={async (num) => {
            await addNumberToList(selectedList, num);
            setNumbers((prev) => [...prev, num]);
          }}
        />
      )}
    </div>
  );
}

export default NumberListManager;
