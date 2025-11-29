const SUDOKU_VARIANTS = {
    // Sudoku 4x4 (2x2 regions)
    4: {
        name: "Mini Sudoku",
        regionSize: 2,
        difficulties: {
            1: { // Dễ
                name: "Dễ",
                cellsToRemove: 4,  // Xóa 4/16 ô (25%)
                description: "Dành cho người mới bắt đầu"
            },
            2: { // Trung bình
                name: "Trung bình",
                cellsToRemove: 6,  // Xóa 6/16 ô (37.5%)
                description: "Độ khó trung bình"
            },
            3: { // Khó
                name: "Khó",
                cellsToRemove: 8,  // Xóa 8/16 ô (50%)
                description: "Thử thách cho người chơi kinh nghiệm"
            }
        },
        maxRemovable: 10, // Tối đa có thể xóa
        minClues: 6       // Tối thiểu phải giữ
    },

    // Sudoku 9x9 (3x3 regions) - Chuẩn
    9: {
        name: "Sudoku Chuẩn",
        regionSize: 3,
        difficulties: {
            1: { // Dễ
                name: "Dễ",
                cellsToRemove: 30,  // Xóa 30/81 ô (37%)
                description: "Mức độ cơ bản, nhiều gợi ý"
            },
            2: { // Trung bình
                name: "Trung bình",
                cellsToRemove: 45,  // Xóa 45/81 ô (55.5%)
                description: "Độ khó phổ thông"
            },
            3: { // Khó
                name: "Khó",
                cellsToRemove: 55,  // Xóa 55/81 ô (68%)
                description: "Thách thức trí tuệ"
            },
            4: { // Expert
                name: "Chuyên gia",
                cellsToRemove: 60,  // Xóa 60/81 ô (74%)
                description: "Dành cho cao thủ"
            }
        },
        maxRemovable: 65, // Tối đa có thể xóa
        minClues: 16      // Tối thiểu phải giữ
    },

    // Sudoku 16x16 (4x4 regions)
    16: {
        name: "Super Sudoku",
        regionSize: 4,
        difficulties: {
            1: { // Dễ
                name: "Dễ",
                cellsToRemove: 120,  // Xóa 120/256 ô (47%)
                description: "Khởi động với Super Sudoku"
            },
            2: { // Trung bình
                name: "Trung bình",
                cellsToRemove: 160,  // Xóa 160/256 ô (62.5%)
                description: "Trải nghiệm đầy đủ"
            },
            3: { // Khó
                name: "Khó",
                cellsToRemove: 190,  // Xóa 190/256 ô (74%)
                description: "Siêu thử thách"
            }
        },
        maxRemovable: 200, // Tối đa có thể xóa
        minClues: 56       // Tối thiểu phải giữ
    },

};

export default SUDOKU_VARIANTS;